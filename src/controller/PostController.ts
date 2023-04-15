import { Request, Response } from "express";
import { Post } from "../entity/Post";
import { myDataBase } from "../db";
import { User } from "../entity/User";
import { JwtRequest } from "../middleware/AuthMiddleware";

export class PostController {
  static createPost = async (req: JwtRequest, res: Response) => {
    const { title, body } = req.body;
    // 토큰 복호화를 통해 찾아낸 유저 번호
    const { id: userId } = req.decoded;
    // 해당 번호를 토대로 db 에서 유저 찾아냄
    const user = await myDataBase.getRepository(User).findOneBy({
      id: userId,
    });

    const post = new Post();
    post.title = title;
    post.body = body;
    post.author = user; // 해당 user 를 author 로 등록
    const result = await myDataBase.getRepository(Post).insert(post);

    res.status(201).send({ message: "success" }); // 성공 여부만 응답으로 주도록
  };
  static getPosts = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).find({
      select: {
        author: {
          // author 에서 필요한 것만 갖고오도록 (즉, 비밀번호 등은 표시되지 않도록)
          id: true,
          username: true,
          email: true,
        },
      },
      relations: {
        // 데이터 가져올 때 author 도 표시하도록 설정
        author: true,
      },
    });
    res.send(results);
  };
  static getPost = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).findOne({
      where: { id: Number(req.params.id) },
      select: {
        author: {
          id: true,
          username: true,
          email: true,
        },
      },
      relations: {
        author: true,
      },
    });
    res.send(results);
  };
  static updatePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;

    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { id: Number(req.params.id) },
      relations: {
        author: true, // 데이터 가져올 때 author 도 표시하도록 설정 / ['author'] 라고 작성해도 됨
      },
    });
    if (userId !== currentPost.author.id) {
      // 글 작성자와 요청 보낸 사람이 일치하지 않으면
      return res.status(401).send("No Permission"); // 거부
    }

    const { title, body } = req.body;
    const newPost = new Post();
    newPost.title = title;
    newPost.body = body;

    const results = await myDataBase
      .getRepository(Post)
      .update(Number(req.params.id), newPost);
    res.send(results);
  };
  static deletePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;

    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { id: Number(req.params.id) },
      relations: {
        author: true,
      },
    });
    if (userId !== currentPost.author.id) {
      // 글 작성자와 요청 보낸 사람이 일치하지 않으면
      return res.status(401).send("No Permission"); // 거부
    }

    const results = await myDataBase
      .getRepository(Post)
      .delete(Number(req.params.id));
    res.send(results);
  };
}
