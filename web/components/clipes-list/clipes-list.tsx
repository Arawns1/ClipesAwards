"use client";
import { VoteType } from "@/@types/Clipe";
import useGetAllClipes from "@/hooks/useFetchAllClipes";
import { useState } from "react";
import ClipeItem from "../clipe-item/clipe-item";
import { CommentsDialog } from "../comments";
import CongratulationsAlert from "./components/congratulations-alert";
import InfiniteScroll from "./components/infinite-scroll";
import LoginVoteAlert from "./components/login-vote-alert";

export function ClipesList() {
  const response = useGetAllClipes();

  // Login Alert
  const [isLoginError, setIsLoginError] = useState(false);
  const [errorVoteType, setErrorVoteType] = useState<VoteType | null>(null);
  const showVoteLoginAlert = (vote: VoteType) => {
    console.log("opi");
    setErrorVoteType(vote);
    setIsLoginError(true);
  };

  // Comments Dialog
  const [commentsDialog, setCommentsDialog] = useState<{
    open: boolean;
    clipId: string | null;
  }>({ open: false, clipId: null });
  const openComments = (clipId: string) => {
    setCommentsDialog({ open: true, clipId });
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
            <ClipeItem.Actions
              clipId={clipe.clip_id}
              onVoteError={showVoteLoginAlert}
              onOpenComments={() => openComments(clipe.clip_id)}
            />
          </ClipeItem>
        )}
      />

      {commentsDialog.open && (
        <CommentsDialog
          open={true}
          clipId={commentsDialog.clipId}
          onOpenChange={(open) => {
            if (!open) setCommentsDialog({ open: false, clipId: null });
            else setCommentsDialog((st) => ({ ...st, open }));
          }}
        />
      )}

      {isLoginError && (
        <LoginVoteAlert
          open={isLoginError}
          onOpenChange={setIsLoginError}
          errorVoteType={errorVoteType}
        />
      )}
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
