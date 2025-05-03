export type User = {
  id: string;
  username: string;
  avatar_url: string;
};

export type UserWithoutId = Omit<User, "id">;
