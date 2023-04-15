import { Router } from "express";
import { PostController } from "../controller/postController";
import { upload } from "../uploadS3";

const routes = Router();

routes.post("", upload.single("img"), PostController.createPost);
routes.get("", PostController.getPosts);
routes.get("/:id", PostController.getPost);

export default routes;
