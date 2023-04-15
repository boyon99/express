import * as express from "express";
import { myDataBase } from "./db";
import AuthRouter from "./router/auth";
import * as cors from "cors";
// 캐시 형태로 발급된 토큰을 저장하기 위한 객체
// 실제로는 redis 를 활용함
export const tokenList = {};

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
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: true, // 모두 허용
  })
);

app.use("/auth", AuthRouter); // AuthRouter 를 지정

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
