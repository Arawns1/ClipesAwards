import { VoteType } from "@/@types/Clipe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";

interface LoginVoteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorVoteType: VoteType | null;
}

export default function LoginVoteAlert({
  open,
  onOpenChange,
  errorVoteType,
}: LoginVoteAlertProps) {
  const { login } = useAuth();

  const loginErrorMessages: Record<
    VoteType,
    { emoji: string; title: string; description: string }
  > = {
    UP: {
      emoji: "🎉🚀",
      title: "Esse clipe parece bom!",
      description: "Mas antes de votar você precisa fazer login... Bora lá?",
    },
    DOWN: {
      emoji: "😭💔",
      title: "Calma ae paizão...",
      description:
        "Esse clipe realmente não parece tão bom, mas antes de votar você precisa fazer login... Bora lá?",
    },
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col items-center justify-center gap-12 px-12">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center justify-center gap-4">
            <span className="text-6xl ">
              {errorVoteType && loginErrorMessages[errorVoteType].emoji}
            </span>
            <span className="text-2xl font-semibold">
              {errorVoteType && loginErrorMessages[errorVoteType].title}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-center justify-center text-center">
            {errorVoteType && loginErrorMessages[errorVoteType].description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar só olhando...</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              login();
            }}
          >
            Bora!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
