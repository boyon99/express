import { Request, Response } from "express";
import { Post } from "../entity/Post";
import { myDataBase } from "../db";

interface MulterS3Request extends Request {
  // 넘어오는 파일을 고려해서 타입 작성
  file: Express.MulterS3.File;
}

export class PostController {
  static createPost = async (req: MulterS3Request, res: Response) => {
    const { title, body } = req.body;
    const { location } = req.file; // s3 주소 가져오기

    const post = new Post();
    post.title = title;
    post.body = body;
    post.img = location; // s3 주소를 지정
    const result = await myDataBase.getRepository(Post).save(post);

    res.status(201).send(result);
  };
  static getPosts = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).find();
    res.send(results);
  };
  static getPost = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).findOneBy({
      id: Number(req.params.id),
    });
    res.send(results);
  };
}
