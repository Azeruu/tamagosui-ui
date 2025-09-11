import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutateAdoptPet } from "@/hooks/useMutateAdoptPet";
import { Loader2Icon, PartyPopper } from "lucide-react";

const INITIAL_PET_IMAGE_URL =
    "https://tan-kind-lizard-741.mypinata.cloud/ipfs/bafkreidkhjpthergw2tcg6u5r344shgi2cdg5afmhgpf5bv34vqfrr7hni";

interface AdoptCardProps {
    onAdoptSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}

export default function AdoptCard({
    onAdoptSuccess,
    onCancel,
    className = ""
}: AdoptCardProps) {
    const [petName, setPetName] = useState("");
    const { mutate: mutateAdoptPet, isPending: isAdopting } = useMutateAdoptPet();

    const handleAdoptPet = () => {
        if (!petName.trim()) return;
        mutateAdoptPet({ name: petName });
    };

    const handleCancel = () => {
        setPetName("");
        onCancel?.();
    };

    return (
        <Card className={`w-full max-w-sm md:max-w-xl text-center flex flex-col item-center justify-between shadow-hard px-5 border-2 border-primary ${className}`}>
            <CardHeader className="pt-5 w-full flex flex-col justify-center items-center space-y-6">
                <CardTitle className="text-3xl">ADOPT YOUR PET</CardTitle>
                <PartyPopper className="text-foreground size-30" />
                <CardDescription>A new friend awaits!</CardDescription>
            </CardHeader>

            <CardContent className="w-full space-y-6">
                <div>
                    <img
                        src={INITIAL_PET_IMAGE_URL}
                        alt="Your new pet"
                        className="w-40 h-40 mx-auto image-rendering-pixelated bg-secondary p-2 border-2 border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-lg">What will you name it?</p>
                    <Input
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Enter pet's name"
                        disabled={isAdopting}
                        className="text-center text-lg border-2 border-primary focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && petName.trim() && !isAdopting) {
                                handleAdoptPet();
                            }
                        }}
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleAdoptPet}
                        disabled={!petName.trim() || isAdopting}
                        className="flex-1 text-lg py-6 border-2 border-primary shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                        {isAdopting ? (
                            <>
                                <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />{" "}
                                Adopting...
                            </>
                        ) : (
                            "ADOPT NOW"
                        )}
                    </Button>

                    {onCancel && (
                        <Button
                            onClick={handleCancel}
                            disabled={isAdopting}
                            variant="outline"
                            className="px-6 text-lg py-6 border-2 border-gray-400"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}