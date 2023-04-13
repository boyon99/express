import * as express from "express";
import { Request, Response } from "express";

const app = express();

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
