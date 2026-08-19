
import { Router } from "express";
import {getFavorites} from "../controllers/favorite.controller"

const favoriteRouter = Router();

favoriteRouter.get("/users/:id/favorites", getFavorites);

export default favoriteRouter;