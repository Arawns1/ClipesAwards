export type ClipeDTO = {
  nextCursor: string;
  prevCursor: string;
  data: Clipe[];
};

export type Clipe = {
  clip_id: string;
  video_src: string;
  posted_at: string;
  user: User;
  message_id: string;
  total_votes: number;
  previous_user_vote?: VoteType;
};

export type User = {
  id: string;
  name: string;
  avatar_url: string;
};

export type VoteType = "UP" | "DOWN";
