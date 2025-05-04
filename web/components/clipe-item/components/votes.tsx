"use client";
import { VoteType } from "@/@types/Clipe";
import { voteOnClip } from "@/lib/api/clips";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { ApiError } from "@/@types/Errors";

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

  const increment = () => setVotes((prevCount) => prevCount + 1);

  const decrement = () => setVotes((prevCount) => prevCount - 1);

  const handleVote = async (vote: VoteType) => {
    setIsLoading(true);

    const previousValue = value;
    const previousVotes = votes;

    setValue(vote);

    const rollbackVote = () => {
      setValue(previousValue);
      setVotes(previousVotes);
    };

    const applyVoteChange = () => {
      if (!vote) {
        if (previousValue === "UP") decrement();
        if (previousValue === "DOWN") increment();
      } else {
        if (vote === "UP") increment();
        if (vote === "DOWN") decrement();
      }
    };

    applyVoteChange();

    try {
      const response = await voteOnClip(clipId, vote || previousValue);
      setVotes(response.total_votes);
    } catch (error) {
      rollbackVote();
      const err = error as ApiError;
      if (err.statusCode === 401) {
        onVoteError(vote || previousValue, err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          className="data-[state=on]:bg-blue-500 data-[state=on]:text-white cursor-pointer"
        >
          <ArrowUp className="h-4 w-4" />
        </ToggleGroupItem>
        <span className="mx-2 text font-bold">{votes}</span>
        <ToggleGroupItem
          disabled={isLoading}
          value="DOWN"
          aria-label="Toggle downvote"
          className="data-[state=on]:bg-red-500 data-[state=on]:text-white cursor-pointer"
        >
          <ArrowDown className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}

export { VotesComponent };
