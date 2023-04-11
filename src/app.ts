import * as express from "express";

const app = express();

app.listen(2000, () => {
  console.log("express server has started on port 2000");
});
