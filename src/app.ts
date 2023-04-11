import * as express from "express";
import { myDataBase } from "./db";
import { Request, Response } from "express";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";

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
app.use(express.json());

// 글 조회하기
app.get("/posts", async function (req: Request, res: Response) {
  const result = await myDataBase.getRepository(Post).find({
    // 외래키로 연결된 필드 데이터를 가져오고 싶다
    relations: ["comments"],
  });
  return res.send(result);
});

// 글 하나만 가져오기
app.get("/posts/:id", async function (req: Request, res: Response) {
  const post = await myDataBase.getRepository(Post).findOneBy({
    id: Number(req.params.id),
  });
  if (!post) {
    return res.status(404).send("No Content");
  }
  return res.send(post);
});

// 글 하나 삭제하기
app.delete("/posts/:id", async function name(req: Request, res: Response) {
  const result = await myDataBase.getRepository(Post).delete(req.params.id);
  return res.send(result);
});

// 글 하나 수정하기
app.put("/posts/:id", async function name(req: Request, res: Response) {
  const result = await myDataBase
    .getRepository(Post)
    .update(req.params.id, req.body);
  return res.send(result);
});

// 글 작성하기
app.post("/posts", async function (req: Request, res: Response) {
  const { title, body } = req.body;
  const post = new Post();
  post.title = title;
  post.body = body;
  const result = await myDataBase.getRepository(Post).insert(post);
  return res.send(result);
});

// 코멘트 작성하기
app.post("/comments", async function (req: Request, res: Response) {
  const { postId, body } = req.body;
  const post = await myDataBase.getRepository(Post).findOneBy({
    id: postId,
  }); // 해당 postId 를 가진 게시글이 있는지 확인
  const comment = new Comment();
  comment.body = body;
  comment.post = post; // 해당 게시글이랑 댓글을 연결
  const result = await myDataBase.getRepository(Comment).insert(comment);
  return res.send(result);
});

app.listen(2000, () => {
  console.log("express server has started on port 2000");
});
