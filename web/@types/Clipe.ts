import { UserWithoutId } from "./User";

export type ClipeDTO = {
  nextCursor: string;
  // prevCursor: string;
  data: Clipe[];
};

export type Clipe = {
  clip_id: string;
  posted_at: string;
  video_src: string;
  user: UserWithoutId;
};

export type VoteType = "UP" | "DOWN";

export type ClipeStatsDTO = {
  previous_user_vote?: VoteType;
  total_votes: number;
  total_comments: number;
};
