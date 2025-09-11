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

const mutateAddAccessory = ["mutate", "add_accessory"];

type UseMutateAddAccParams = {
    accId: string;
};

export function useAddAccessory() {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: mutateAddAccessory,
        mutationFn: async ({ accId }: UseMutateAddAccParams) => {

            const tx = new Transaction();
            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::add_accessory`,
                arguments: [tx.object(accId)],
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
            toast.success(`Accessory Added successfully! Tx: ${response.digest}`);

            queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
        },
        onError: (error) => {
            console.error("Error Added Accessory:", error);
            toast.error(`Error Added Accessory: ${error.message}`);
        },
    });
}