import * as express from "express";
import { Request, Response } from "express";
import { upload } from "./upload";

const app = express();

app.use(express.json());
// multipart 형식의 데이터도 요청으로 받을 수 있도록 설정하기
app.use(
  express.urlencoded({
    extended: true,
  })
);

// 요청이 들어오는 경우
app.post("/upload", upload.single("img"), (req: Request, res: Response) => {
  res.json(req.file);
});

app.listen(2000, () => {
  console.log("Express server has started on port 2000");
});
