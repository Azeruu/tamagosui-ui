import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useQueryOwnedPets } from "@/hooks/useQueryOwnedPets";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/header";
import PetCardSimple from "./PetCard";
import type { PetStruct } from "@/types/pet";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPets, isPending: isOwnedPetLoading } = useQueryOwnedPets();

  // console.log("Owned Pets:", ownedPets);
  const petsArray = ownedPets ? Object.values(ownedPets) : [];
  console.log("Pets Array:", petsArray);
  
  let content;
  if (!currentAccount) {
    content = (
      <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
        <h2 className="text-4xl uppercase">Please Connect Wallet</h2>
      </div>
    );
  } else if (isOwnedPetLoading) {
    content = (
      <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
        <h2 className="text-4xl uppercase">Loading Pet...</h2>
      </div>
    );
  } else if (petsArray && petsArray.length > 0) {
    // Tampilkan semua pets
    content = (
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl uppercase mb-4">My Pets ({petsArray.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {petsArray
    .filter((pet): pet is PetStruct => typeof pet === "object" && pet !== null && "id" in pet)
    .map((pet) => (
      <PetCardSimple key={pet.id} pet={pet} />
    ))}
</div>
      </div>
    );
  } else {
    content = <AdoptComponent />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-24">
        {content}
      </main>
    </div>
  );
}


import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";