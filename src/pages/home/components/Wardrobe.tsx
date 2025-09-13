import { GlassesIcon, Loader2Icon, WarehouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

import { UseMutateEquipAccessory } from "@/hooks/useMutateEquipAccessory";
import { useMutateMintAccessory } from "@/hooks/useMutateMintAccessory";
import { UseMutateUnequipAccessory } from "@/hooks/useMutateUnequipAccessory";
import { useQueryEquippedAccessory } from "@/hooks/useQueryEquippedAccessory";
import { useQueryOwnedAccessories } from "@/hooks/useQueryOwnedAccessories";
import { AddAccessoryDialog } from "./AddAccessoryDialog";

import type { PetStruct } from "@/types/pet";

type WardrobeManagerProps = {
  pet: PetStruct;
  isAnyActionPending: boolean;
};

export function WardrobeManager({
  pet,
  isAnyActionPending,
}: WardrobeManagerProps) {
  // --- Hooks for Actions ---
  const { mutate: mutateMint, isPending: isMinting } = useMutateMintAccessory();
  const { mutate: mutateEquip, isPending: isEquipping } =
    UseMutateEquipAccessory();
  const { mutate: mutateUnequip, isPending: isUnequipping } =
    UseMutateUnequipAccessory();

  // --- Wardrobe Data Fetching Hooks ---
  const { data: ownedAccessories, isLoading: isLoadingAccessories } =
    useQueryOwnedAccessories();
  const { data: equippedAccessory, isLoading: isLoadingEquipped } =
    useQueryEquippedAccessory({ petId: pet.id });

  // A specific loading state for wardrobe actions to disable buttons.
  const isProcessingWardrobe = isMinting || isEquipping || isUnequipping;
  const isLoading = isLoadingAccessories || isLoadingEquipped;

  const renderContent = () => {
    // Priority 1: Handle the loading state first to prevent UI flicker.
    if (isLoading) {
      return (
        <p className="text-sm text-muted-foreground">Loading wardrobe...</p>
      );
    }
    // Priority 2: Check if an accessory is currently equipped. If so, show the "Unequip" UI.
    if (equippedAccessory) {
      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <img
              src={equippedAccessory.image_url}
              alt={equippedAccessory.name}
              className="w-12 h-12 rounded-md border p-1 bg-transparent"
            />
            <p className="text-sm font-semibold">
              Equipped: <strong>{equippedAccessory.name}</strong>
            </p>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => mutateUnequip({ petId: pet.id })}
            disabled={isAnyActionPending || isProcessingWardrobe}
            variant="destructive"
            size="sm"
          >
            {isUnequipping && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Unequip
          </Button>
        </div>
      );
    }
    // Priority 3: If nothing is equipped, check the user's wallet inventory.
    if (ownedAccessories && ownedAccessories.length > 0) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img
                src={ownedAccessories[0].image_url}
                alt={ownedAccessories[0].name}
                className="w-12 h-12 rounded-md border p-1 bg-white"
              />
              <p className="text-sm font-semibold">{ownedAccessories[0].name}</p>
            </div>
            <Button
              className="cursor-pointer"
              onClick={() =>
                mutateEquip({
                  petId: pet.id,
                  accessoryId: ownedAccessories[0].id.id,
                })
              }
              disabled={isAnyActionPending || isProcessingWardrobe}
              size="sm"
            >
              {isEquipping && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Equip
            </Button>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Want more accessories? Create custom ones below!
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => mutateMint()}
              disabled={isAnyActionPending || isProcessingWardrobe}
              className="flex-1 cursor-pointer bg-transparent text-white border border-primary hover:bg-primary/10 text-xs"
            >
              {isMinting ? (
                <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <GlassesIcon className="mr-1 h-3 w-3" />
              )}{" "}
              Mint Glasses
            </Button>
            <AddAccessoryDialog disabled={isAnyActionPending || isProcessingWardrobe} />
          </div>
        </div>
      );
    }
    // Priority 4: If nothing is equipped and inventory is empty, show the "Mint" and "Add Custom" buttons.
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-sm text-muted-foreground text-center">
          No accessories available. Create one below!
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => mutateMint()}
            disabled={isAnyActionPending || isProcessingWardrobe}
            className="w-full cursor-pointer bg-transparent text-white border border-primary hover:bg-primary/10"
          >
            {isMinting ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GlassesIcon className="mr-2 h-4 w-4" />
            )}{" "}
            Mint Cool Glasses
          </Button>
          <AddAccessoryDialog disabled={isAnyActionPending || isProcessingWardrobe} />
        </div>
      </div>
    );
  };

  return (
    <CardFooter className="flex flex-col gap-4 pt-6 md:w-xl border border-primary bg-secondary-daisy/20 h-full ">
      <div className="font-bold text-foreground flex items-center gap-2 mx-auto flex-end text-xl">
        <WarehouseIcon size={25} /> WARDROBE
      </div>
      <div className="w-full text-center p-2 bg-transparent rounded-lg min-h-[72px] flex items-center justify-center">
        {renderContent()}
      </div>
    </CardFooter>
  );
}