import { Router } from "express";
import { PostController } from "../controller/PostController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const routes = Router();

routes.post("", AuthMiddleware.verifyToken, PostController.createPost);
routes.get("", PostController.getPosts);
routes.get("/:id", PostController.getPost);
routes.put("/:id", AuthMiddleware.verifyToken, PostController.updatePost);
routes.delete("/:id", AuthMiddleware.verifyToken, PostController.deletePost);

export default routes;
