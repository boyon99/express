import * as express from "express";
import { myDataBase } from "./db";
import AuthRouter from "./router/auth";
import PostsRouter from "./router/posts";
import * as cookieParser from "cookie-parser"; // 불러오기
import * as cors from "cors";
export const tokenList = {};

myDataBase
  .initialize()
  .then(() => {
    console.log("DataBase has been initialized!");
  })
  .catch((err) => {
    console.error("Error during DataBase initialization:", err);
  });

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: true,
  })
);
app.use(cookieParser()); // 사용한다고 명시

app.use("/auth", AuthRouter);
app.use("/posts", PostsRouter);

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
