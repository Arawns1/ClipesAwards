"use client";
import useGetAllClipes from "@/hooks/useFetchAllClipes";
import CongratulationsAlert from "./components/congratulations-alert";
import InfiniteScroll from "./components/infinite-scroll";
import { CommentsComponent, VotesComponent } from "../clipe-item/components";
import ClipeItem from "../clipe-item/clipe-item";
import LoginVoteAlert from "./components/login-vote-alert";
import { VoteType } from "@/@types/Clipe";
import { useState } from "react";

export function ClipesList() {
  const response = useGetAllClipes();
  const [isLoginError, setIsLoginError] = useState(false);
  const [errorVoteType, setErrorVoteType] = useState<VoteType | null>(null);

  const showVoteLoginAlert = (vote: VoteType) => {
    setErrorVoteType(vote);
    setIsLoginError(true);
  };

  return (
    <>
      <InfiniteScroll
        queryResponse={response}
        pendingComponent={<ClipesListSkeleton />}
        loadingMoreComponent={<ClipesListSkeleton />}
        hasNoMorePagesComponent={<CongratulationsAlert />}
        itemContent={(index, clipe) => (
          <ClipeItem key={clipe.clip_id}>
            <ClipeItem.User user={clipe.user} posted_at={clipe.posted_at} />
            <ClipeItem.Video src={clipe.video_src} />
            <ClipeItem.Actions>
              <VotesComponent
                clipId={clipe.clip_id}
                initialVotes={clipe.total_votes}
                previousVoteValue={clipe.previous_user_vote}
                onVoteError={showVoteLoginAlert}
              />
              <CommentsComponent />
            </ClipeItem.Actions>
          </ClipeItem>
        )}
      />
      <LoginVoteAlert
        open={isLoginError}
        onOpenChange={setIsLoginError}
        errorVoteType={errorVoteType}
      />
    </>
  );
}

export function ClipesListSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      <ClipeItem.Skeleton />
      <ClipeItem.Skeleton />
      <ClipeItem.Skeleton />
      <ClipeItem.Skeleton />
      <ClipeItem.Skeleton />
      <ClipeItem.Skeleton />
    </section>
  );
}
