import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "process";
import { toast } from "sonner";

export function useRelasePet() {
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const mutation = useMutation({
    // Mutation key untuk identifikasi
    mutationKey: ["petRelased", account?.address],

    // Fungsi utama yang dieksekusi saat mutasi dipanggil
    mutationFn: async (nftObjectId: string) => {
      if (!account?.address) {
        throw new Error("Wallet not connected.");
      }

      const tx = new Transaction();

      // Memanggil fungsi `burn_nft` di smart contract
      tx.moveCall({
        target: `${env.VITE_PACKAGE_ID}::tamagosui::relase_pet`,
        arguments: [
          tx.object(nftObjectId), // Argumennya hanya objek NFT itu sendiri
        ],
      });

      // Menandatangani dan mengirim transaksi
      return signAndExecute({
        transaction: tx,
      });
    },

    // Callback saat transaksi berhasil
    onSuccess: () => {
      toast.success("Your Pet has Been Relased!", { id: "relase_pet" });
      // Me-refresh data NFT pengguna agar UI terupdate
      queryClient.refetchQueries({ queryKey: ["owned-pet"] });
    },

    // Callback saat terjadi error
    onError: (error: Error) => {
      toast.error(error.message, { id: "relase_pet" });
    },

    // Callback yang dieksekusi tepat sebelum mutationFn
    onMutate: () => {
      toast.loading("Relasing Pet...", { id: "relase_pet" });
    },
  });

  return mutation;
}
