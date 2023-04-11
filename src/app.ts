import * as express from "express";
import { myDataBase } from "./db";

// DB 연결하기
myDataBase
  .initialize()
  .then(() => {
    console.log("database has been initialzed");
  })
  .catch((err) => {
    console.error("error:", err);
  });

const app = express();

app.listen(2000, () => {
  console.log("express server has started on port 2000");
});
