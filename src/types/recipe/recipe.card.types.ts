import { PageMeta } from "../pagination.types";

export interface RecipeCard {
  id: string;
  title: string;
  description: string | null;
  mainImage: string | null;
  time: string | null;
  owner: {
    id: string;
    name: string;
    avatar: string | null;
  };
  isFavorite: boolean;
}

export interface RecipeListPage extends PageMeta {
  recipes: RecipeCard[];
}
