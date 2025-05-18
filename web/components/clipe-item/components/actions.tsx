import { VotesComponent, VotesComponentSkeleton } from "./votes";
import { VoteType } from "@/@types/Clipe";
import { useFetchClipStats } from "@/hooks/useFetchClipStats";
import {
  CommentsComponent,
  CommentsComponentSkeleton,
} from "@/components/comments/comments-component";

interface Props {
  clipId: string;
  onVoteError: (vote: VoteType, err: unknown) => void;
  onOpenComments: () => void;
}

function ActionsComponent({ clipId, onVoteError, onOpenComments }: Props) {
  const { data: clipe, isPending } = useFetchClipStats(clipId);

  if (isPending || !clipe) {
    return <ActionsComponentSkeleton />;
  }

  return (
    <div className="flex">
      <div className="flex justify-center items-center mt-2 gap-2">
        <VotesComponent
          clipId={clipId}
          initialVotes={clipe.total_votes}
          previousVoteValue={clipe.previous_user_vote}
          onVoteError={onVoteError}
        />
        <CommentsComponent
          initialCommentsCount={clipe.total_comments}
          onClick={onOpenComments}
        />
      </div>
    </div>
  );
}

function ActionsComponentSkeleton() {
  return (
    <div className="flex">
      <div className="flex justify-center items-center mt-2 gap-2">
        <VotesComponentSkeleton />
        <CommentsComponentSkeleton />
      </div>
    </div>
  );
}

export { ActionsComponent, ActionsComponentSkeleton };
