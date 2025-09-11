import {
    useCurrentAccount,
    useSuiClient,
    useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeyOwnedPet } from "./useQueryOwnedPet";
import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

const mutateRelasePet = ["mutate", "release-pet"];

type UseMutateRelasePetParams = {
    petId: string;
};

export function useMutateRelasePet() {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mutateRelasePet,
        mutationFn: async ({ petId }: UseMutateRelasePetParams) => {
            if (!currentAccount) throw new Error("No connected account");

            const tx = new Transaction();
            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::release_pet`,
                arguments: [tx.object(petId)],
            });

            const { digest } = await signAndExecute({ transaction: tx });
            const response = await suiClient.waitForTransaction({
                digest,
                options: { showEffects: true, showEvents: true },
            });
            if (response?.effects?.status.status === "failure")
                throw new Error(response.effects.status.error);

            return response;
        },
        onSuccess: (response) => {
            toast.success(`Pet Release successfully! Tx: ${response.digest}`);

            queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
        },
        onError: (error) => {
            console.error("Error Releasing pet:", error);
            toast.error(`Error Releasing pet: ${error.message}`);
        },
    });
}