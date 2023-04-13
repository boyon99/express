import { Request } from "express";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();

interface KeyCallback {
  (error: any, key?: string): void;
}

const s3 = new S3Client({
  // aws-sdk 가 제공하는 s3 접속 클라이언트 객체를 만들고,
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // 방금 발급받은 키를 입력해주세요.
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // 방금 발급받은 키를 입력해주세요.
  },
});
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "boyon", // 방금 생성한 버킷 이름을 입력해주세요.
    acl: "public-read", // 업로드된 파일은 누구나 읽을 수 있게 설정
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: Express.Multer.File, cb: KeyCallback) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
