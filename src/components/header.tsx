import { ConnectButton } from "@mysten/dapp-kit";
import { EggFried } from "lucide-react";

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-10 backdrop-blur-sm pt-3">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter flex justify-center items-center">
          TAMAG<EggFried className="pt-1 md:pt-0 size-7 md:size-9"/>SUI
        </h1>
        <ConnectButton />
      </div>
    </header>
  );
}