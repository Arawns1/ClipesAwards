"use client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import packageJson from "../../package.json";

export default function ModalSobreComponent() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            Sobre
          </Button>
        </DialogTrigger>
        <DialogContent className="border p-4 h-[400px] w-[450px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-3xl bg-card shadow-sm dark:bg-card-dark dark:border-card-dark-border z-[9999] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Sobre o site</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-around h-full gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-2xl font-extralight tracking-wider">
                Clipe Awards
              </h1>

              <p>Versão: {packageJson.version}</p>
            </div>

            <div>
              <p className="text-center px-1">
                O Clipe Awards é um site dedicado a compartilhar e votar em
                clipes de jogos, permitindo que os usuários enviem seus próprios
                clipes para serem avaliados pela comunidade.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                window.open("https://github.com/Arawns1/ClipesAwards", "_blank")
              }
            >
              <Github />
              GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
