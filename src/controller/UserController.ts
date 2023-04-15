import { verify } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { myDataBase } from "../db";
import { User } from "../entity/User";
import {
  generateAccessToken,
  generatePassword,
  generateRefreshToken,
  registerToken,
} from "../util/Auth";
import { Request, Response } from "express";

export class UserController {
  static register = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    // 중복 유저 체크
    const existUser = await myDataBase.getRepository(User).findOne({
      where: [
        { email }, // 이메일이 일치하거나
        { username }, // 유저네임이 일치하는 데이터가 있는지 확인
      ],
    });
    if (existUser) {
      // 일치하는 유저가 있다면 400 리턴
      return res.status(400).json({ error: "Duplicate User" });
    }

    // 유저 생성
    const user = new User();
    user.email = email;
    user.password = await generatePassword(password); // 암호화된 비밀번호 생성
    user.username = username;
    // 익숙해지셨다면 여기서 try catch 로 db 에 접근 못했을 때의 에러 처리도 해주는 것이 좋음!
    // save 의 경우 insert 와 다르게 해당 id 의 데이터가 이미 있다면 업데이트하는 로직을 가지고 있음 (사용 시 주의 필요)
    const newUser = await myDataBase.getRepository(User).save(user); // 유저 생성 완료

    // 만약 회원가입 시 자동 로그인 구현하고 싶다면, 여기서 토큰 발급까지 구현
    // 액세스 토큰 및 리프레시 토큰 발급
    const accessToken = generateAccessToken(
      newUser.id,
      newUser.username,
      newUser.email
    );
    const refreshToken = generateRefreshToken(
      newUser.id,
      newUser.username,
      newUser.email
    );
    // 어떤 토큰을 발급했는지 저장해놓기
    registerToken(refreshToken, accessToken);
    // 토큰을 복호화해서, 담겨있는 유저 정보 및 토큰 만료 정보도 함께 넘겨줌
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    res.send({ content: decoded, accessToken });
  };
  static login = async (req: Request, res: Response) => {
    // 로그인
    const { email, password } = req.body;

    // db 에 유저가 있는지 확인
    const user = await myDataBase.getRepository(User).findOne({
      where: { email },
    });
    // 유저가 없다면 400 return
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 유저가 있다면 비밀번호 일치하는지 확인
    const validPassword = await bcrypt.compare(password, user.password);
    // 일치하지 않으면 400 return
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    // 액세스 토큰 및 리프레시 토큰 발급
    const accessToken = generateAccessToken(user.id, user.username, user.email);
    const refreshToken = generateRefreshToken(
      user.id,
      user.username,
      user.email
    );
    // 어떤 토큰을 발급했는지 저장해놓기
    registerToken(refreshToken, accessToken);
    // 토큰을 복호화해서, 담겨있는 유저 정보도 함께 넘겨줌
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
    res.send({ content: decoded, accessToken });
  };
}
