import { PageMeta } from "./pagination.types";

export interface RecipePreview {
  id: string;
  title: string;
  mainImage: string | null;
}

export interface UserCard {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
  // relative to the authenticated user, not to the profile being viewed
  isFollowing: boolean;
  recipes: RecipePreview[];
}

export interface UserListPage extends PageMeta {
  users: UserCard[];
}
