import { Router } from "express";
import { UserController } from "../controller/UserController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const routes = Router();

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);
routes.get(
  "/refresh",
  AuthMiddleware.verifyRefreshToken,
  UserController.refresh
);
routes.get("/verify", AuthMiddleware.verifyToken, UserController.verify);

export default routes;
