import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";
import { normalizeSuiPetObject } from "@/lib/utils";

export const queryKeyOwnedPets = (address?: string) => {
  if (address) return ["owned-pet", address];
  return ["owned-pet"];
};

export function useQueryOwnedPets() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: queryKeyOwnedPets(currentAccount?.address),
    queryFn: async () => {
      if (!currentAccount) throw new Error("No connected account");

      // Get all pet objects
      const petResponse = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Pet` },
        options: { showContent: true },
      });
      
      if (petResponse.data.length === 0) return [];

      const petObjects = petResponse.data;
      const normalizedPetsArray = petObjects
        .map((petObj) => normalizeSuiPetObject(petObj))
        .filter((pet) => pet !== null);

      if (normalizedPetsArray.length === 0) return [];

      // Get sleep status for each pet
      const petsWithSleepStatus = await Promise.all(
        normalizedPetsArray.map(async (pet) => {
          const dynamicFields = await suiClient.getDynamicFields({
            parentId: pet!.id,
          });

          const isSleeping = dynamicFields.data.some(
            (field) =>
              field.name.type === "0x1::string::String" &&
              field.name.value === "sleep_started_at",
          );

          return { ...pet, isSleeping };
        })
      );

      return petsWithSleepStatus;
    },
    enabled: !!currentAccount,
  });
}