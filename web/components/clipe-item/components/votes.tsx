"use client";
import { VoteType } from "@/@types/Clipe";
import { voteOnClip } from "@/lib/api/clips";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";

type VotesComponentProps = {
  clipId: string;
  initialVotes?: number;
  previousVoteValue?: VoteType;
  onVoteError: (vote: VoteType, err: unknown) => void;
};

function VotesComponent({
  initialVotes,
  previousVoteValue,
  clipId,
  onVoteError,
}: VotesComponentProps) {
  const [votes, setVotes] = useState(initialVotes || 0);
  const [value, setValue] = useState(previousVoteValue || "");
  const [isLoading, setIsLoading] = useState(false);

  const increment = () =>
    setVotes((prevCount) => (prevCount === -1 ? 1 : prevCount + 1));

  const decrement = () =>
    setVotes((prevCount) => (prevCount === 1 ? -1 : prevCount - 1));

  const handleVote = async (vote: VoteType) => {
    if (!vote) return;

    const previousValue = value;
    const previousVotes = votes;

    setValue(vote);
    if (vote === "UP") {
      increment();
    } else {
      decrement();
    }

    try {
      setIsLoading(true);
      await voteOnClip(clipId, vote);
    } catch (err) {
      setValue(previousValue);
      setVotes(previousVotes);
      onVoteError(vote, err);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            value="UP"
            aria-label="Toggle upvote"
            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </ToggleGroupItem>
          <span className="mx-2 text font-bold">{votes}</span>
          <ToggleGroupItem
            disabled={isLoading}
            value="DOWN"
            aria-label="Toggle downvote"
            className="data-[state=on]:bg-red-500 data-[state=on]:text-white"
          >
            <ArrowDown className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}

export { VotesComponent };
