import { Request } from "express";
import * as multer from "multer";

interface DestinationCallback {
  (error: Error | null, destination: string): void;
}
interface FileNameCallback {
  (error: Error | null, filename: string): void;
}

// multer를 이용해서 파일을 업로드 할 때
// 해당 파일명이 어땠으면 좋겠는지
// 해당 파일이 정확히 어느 경로에 저장되었으면 좋겠는디
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) {
      cb(null, "./uploads/");
    }, // 업로드 경로를 지정
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) {
      cb(null, Date.now() + "-" + file.originalname);
    }, // 파일명을 지정 (중복을 방지하기 위해 시간 값을 추가)
  }),
});
