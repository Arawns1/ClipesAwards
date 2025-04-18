"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { useState } from "react";
import { voteOnClip } from "@/lib/api/clips";
import { VoteType } from "@/@types/Clipe";

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

  const increment = () =>
    setVotes((prevCount) => (prevCount === -1 ? 1 : prevCount + 1));

  const decrement = () =>
    setVotes((prevCount) => (prevCount === 1 ? -1 : prevCount - 1));

  const handleVote = async (value: VoteType) => {
    if (!value) return;
    if (value) setValue(value);

    try {
      await voteOnClip(clipId, "198930202967932928", value);
      if (value === "UP") {
        increment();
      } else if (value === "DOWN") {
        decrement();
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
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
  );
}

export { VotesComponent };
