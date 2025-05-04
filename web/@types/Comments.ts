import { UserWithoutId } from "./User";

export type CommentDTO = {
  clip_id: string;
  comments: Comment[];
};

export type Comment = {
  id: string;
  text: string;
  created_at: string;
  user: UserWithoutId;
};
