"use client";
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
import { ApiError, voteOnClip } from "@/lib/api/clips";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";

type VotesComponentProps = {
  clipId: string;
  initialVotes?: number;
  previousVoteValue?: VoteType;
};

function VotesComponent({
  initialVotes,
  previousVoteValue,
  clipId,
}: VotesComponentProps) {
  const [votes, setVotes] = useState(initialVotes || 0);
  const [value, setValue] = useState(previousVoteValue || "");
  const [isLoginError, setIsLoginError] = useState(false);
  const [errorVoteType, setErrorVoteType] = useState<VoteType | null>(null);
  const { login } = useAuth();
  const loginErrorMessages: Record<
    VoteType,
    { emoji: string; title: string; description: string }
  > = {
    UP: {
      emoji: "🎉🚀",
      title: "Esse clipe parece realmente bom!",
      description: "Mas antes de votar você precisa fazer login... Bora lá?",
    },
    DOWN: {
      emoji: "😭💔",
      title: "Calma ae paizão...",
      description:
        "Esse clipe realmente não parece tão bom, mas antes de votar você precisa fazer login... Bora lá?",
    },
  };

  const increment = () =>
    setVotes((prevCount) => (prevCount === -1 ? 1 : prevCount + 1));

  const decrement = () =>
    setVotes((prevCount) => (prevCount === 1 ? -1 : prevCount - 1));

  const handleVote = async (vote: VoteType) => {
    if (!vote) return;

    try {
      await voteOnClip(clipId, vote);
      if (vote) setValue(vote);
      return vote === "UP" ? increment() : decrement();
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setErrorVoteType(vote);
        return setIsLoginError(true);
      }
    }
  };

  return (
    <>
      <div className="flex items-center mt-2">
        <ToggleGroup
          size={"sm"}
          type="single"
          value={value}
          onValueChange={handleVote}
        >
          <ToggleGroupItem
            value="UP"
            aria-label="Toggle upvote"
            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </ToggleGroupItem>
          <span className="mx-2 text font-bold">{votes}</span>
          <ToggleGroupItem
            value="DOWN"
            aria-label="Toggle downvote"
            className="data-[state=on]:bg-red-500 data-[state=on]:text-white"
          >
            <ArrowDown className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Diálogo de login */}
      <AlertDialog open={isLoginError} onOpenChange={setIsLoginError}>
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
                setIsLoginError(false);
                login();
              }}
            >
              Bora!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { VotesComponent };
