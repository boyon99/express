import * as express from "express";
import { Request, Response } from "express";
import { myDataBase } from "./db";
import { upload } from "./uploadS3";
import PostRouter from "./router/post";

// db 연결
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

app.use(express.urlencoded());

app.use("/posts", PostRouter); // posts 로 경로 설정

app.post("/upload", upload.single("img"), (req: Request, res: Response) => {
  res.json(req.file);
}); // 업로드 후에, (req, res) => {} 부분이 실행

app.listen(2000, () => {
  console.log("Express server has started on port 2000");
});
