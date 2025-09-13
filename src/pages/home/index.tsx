import { useQueryOwnedPets } from "@/hooks/useQueryOwnedPets";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetCard from "./PetCard";
import Header from "@/components/header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { PetStruct } from "@/types/pet";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPets, isPending: isOwnedPetLoading } = useQueryOwnedPets();

  let petsArray: PetStruct[] = [];
  if (ownedPets) {
    if (Array.isArray(ownedPets)) {
      // Jika data sudah berupa array
      petsArray = ownedPets.filter((pet): pet is PetStruct =>
        typeof pet === "object" && pet !== null && "id" in pet
      );
    } else if (typeof ownedPets === "object") {
      // Jika data berupa object, ambil values-nya
      petsArray = Object.values(ownedPets).filter((pet): pet is PetStruct =>
        typeof pet === "object" && pet !== null && "id" in pet
      );
    } else {
      // Jika ownedPets adalah single pet object
      if (typeof ownedPets === "object" && "id" in ownedPets) {
        petsArray = [ownedPets as PetStruct];
      }
    }
  }
  console.log("pets obeject", ownedPets);
  console.log("pets array", petsArray);

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-24">
        {!currentAccount ? (
          <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
            <h2 className="text-4xl uppercase">Please Connect Wallet</h2>
          </div>
        ) : isOwnedPetLoading ? (
          <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
            <h2 className="text-4xl uppercase">Loading Pet...</h2>
          </div>
        ) : ownedPets ? (
          // <PetComponent pet={ownedPets} />
          petsArray.length > 0 ? (
            <div className="w-full max-w-6xl">
              <Dialog>
                <div className="text-center mb-8 flex justify-between items-center ">
                  <h2 className="text-4xl uppercase mb-4">My Pets ({petsArray.length})</h2>
                  <DialogTrigger asChild>
                    <button className="bg-gray-100/10 backdrop-blur border border-background px-6 py-3 rounded-lg hover:scale-105 transition-transform duratio-300"> Adopt More Pet</button>
                  </DialogTrigger >
                  <DialogContent className="p-10 backdrop-blur bg-gray-100/10">
                    <AdoptComponent />
                  </DialogContent>
                </div>
              </Dialog>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {petsArray.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            </div>
          ) : (
            <AdoptComponent />
          )
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}