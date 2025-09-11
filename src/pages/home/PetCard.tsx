import { useEffect, useState } from "react";
import PetComponent from "./PetComponent";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { useMutateRelasePet } from "@/hooks/useRelasePet2";
import { Button } from "@/components/ui/button";

import type { PetStruct } from "@/types/pet";
type PetDashboardProps = {
    pet: PetStruct;

};

export default function PetCard({ pet }: PetDashboardProps) {
    // --- Fetch Game Balance ---
    const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
    const [displayStats, setDisplayStats] = useState(pet.stats);


    // --- Hooks for Main Pet Actions ---
    const { mutate: mutatePetReleased, isPending: isBurning } =
        useMutateRelasePet();
    const { mutate: mutateFeedPet, isPending: isFeeding } =
        useMutateFeedPet();
    const { mutate: mutatePlayWithPet, isPending: isPlaying } =
        useMutatePlayWithPet();
    const { mutate: mutateWorkForCoins, isPending: isWorking } =
        useMutateWorkForCoins();
    const { mutate: mutateLetPetSleep, isPending: isSleeping } =
        useMutateLetPetSleep();
    const { mutate: mutateWakeUpPet, isPending: isWakingUp } =
        useMutateWakeUpPet();
    const { mutate: mutateLevelUp, isPending: isLevelingUp } =
        useMutateCheckAndLevelUp();

    const handleBurnClick = (objectId: string | undefined) => {
        if (!objectId) {
            console.error("Object ID is missing, cannot release.");
            return;
        }
        mutatePetReleased({ petId: objectId });
    };
    useEffect(() => {
        setDisplayStats(pet.stats);
    }, [pet.stats]);

    useEffect(() => {
        // This effect only runs when the pet is sleeping
        if (pet.isSleeping && !isWakingUp && gameBalance) {
            // Start a timer that updates the stats every second
            const intervalId = setInterval(() => {
                setDisplayStats((prev) => {
                    const energyPerSecond =
                        1000 / Number(gameBalance.sleep_energy_gain_ms);
                    const hungerLossPerSecond =
                        1000 / Number(gameBalance.sleep_hunger_loss_ms);
                    const happinessLossPerSecond =
                        1000 / Number(gameBalance.sleep_happiness_loss_ms);

                    return {
                        energy: Math.min(
                            gameBalance.max_stat,
                            prev.energy + energyPerSecond,
                        ),
                        hunger: Math.max(0, prev.hunger - hungerLossPerSecond),
                        happiness: Math.max(0, prev.happiness - happinessLossPerSecond),
                    };
                });
            }, 1000); // Runs every second

            // IMPORTANT: Clean up the timer when the pet wakes up or the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [pet.isSleeping, isWakingUp, gameBalance]); // Rerun this effect if sleep status or balance changes

    if (isLoadingGameBalance || !gameBalance)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl">Loading Game Rules...</h1>
            </div>
        );

    // --- Client-side UI Logic & Button Disabling ---
    // `isAnyActionPending` prevents the user from sending multiple transactions at once.
    const isAnyActionPending =
        isFeeding || isPlaying || isSleeping || isWorking || isLevelingUp;

    // These `can...` variables mirror the smart contract's rules (`assert!`) on the client-side.
    const canFeed =
        !pet.isSleeping &&
        pet.stats.hunger < gameBalance.max_stat &&
        pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
    const canPlay =
        !pet.isSleeping &&
        pet.stats.energy >= gameBalance.play_energy_loss &&
        pet.stats.hunger >= gameBalance.play_hunger_loss;
    const canWork =
        !pet.isSleeping &&
        pet.stats.energy >= gameBalance.work_energy_loss &&
        pet.stats.happiness >= gameBalance.work_happiness_loss &&
        pet.stats.hunger >= gameBalance.work_hunger_loss;
    const canLevelUp =
        !pet.isSleeping &&
        pet.game_data.experience >=
        pet.game_data.level * Number(gameBalance.exp_per_level);


    return (
        <TooltipProvider>
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="w-full h-full max-w-sm md:max-w-6xl backdrop-blur bg-gray-100/10 shadow-hard border-2 border-background hover:border-hover transition-colors px-5 duration-300 hover:scale-105 transition-transform duration-300 mb-4 cursor-pointer">
                        <CardHeader className="text-center md:w-xl pt-10">
                            <CardTitle className="text-4xl space-5">
                                <h1 className="text-foreground">Your Pet Name Is</h1>
                                <p className="text-3lg">✨ {pet.name} ✨</p>
                            </CardTitle>
                            <div className="flex justify-center">
                                <img
                                    src={pet.image_url}
                                    alt={pet.name}
                                    className="h-full w-full hidden md:block rounded-full border-4 border-primary/20 object-cover"
                                />
                            </div>
                            <CardDescription className="text-2xl text-yellow-600 font-bold">
                                Level
                                <div className="flex justify-center item-center">✨<div className="text-4xl px-4">{pet.game_data.level}</div>✨</div>
                            </CardDescription>
                        </CardHeader>

                        {/* <CardContent className="md:w-xl space-y-4 pt-2 pb-5 md:pt-20"> */}
                        {/* Pet Image */}
                        <div className="flex justify-center block md:hidden">
                            <img
                                src={pet.image_url}
                                alt={pet.name}
                                className="w-36 h-36 rounded-full border-4 border-primary/20"
                            />
                        </div>
                    </Card>
                </DialogTrigger>

                <DialogContent className="w-full max-w-sm md:max-w-7xl backdrop-blur bg-gray-100/10">
                    {/* PetComponent akan ditampilkan di dalam dialog saat diklik */}
                    <PetComponent pet={pet} />
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        disabled={isBurning}
                        onClick={() => handleBurnClick(pet.id)}
                    >
                        <Flame className="w-4 h-4 mr-2" />
                        {isBurning ? "Releasing..." : "Release Pet"}
                    </Button>
                    {/* <Button>hola</Button> */}
                    {/* <p>hallo suii</p> */}
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}