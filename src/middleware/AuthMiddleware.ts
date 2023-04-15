import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { tokenList } from "../app";
dotenv.config();

export interface TokenPayload {
  email: string;
  username: string;
  id: number;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}

export class AuthMiddleware {
  static verifyToken = (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload;
      req.decoded = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
  static verifyRefreshToken = (
    req: JwtRequest,
    res: Response,
    next: NextFunction
  ) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
      // 쿠키에 리프레시 토큰이 없다면 에러
      return res.status(403).json({ error: "No Refresh Token" });
    }
    if (!(cookies.refreshToken in tokenList)) {
      // 우리가 발급한게 아니라면 에러
      return res.status(401).json({ error: "Invalid Refresh Token" });
    }
    try {
      // 기존 리프레시 토큰 복호화
      const decoded = verify(
        cookies.refreshToken,
        process.env.SECRET_RTOKEN
      ) as TokenPayload;
      req.decoded = decoded;
    } catch (err) {
      // 복호화가 제대로 안된다면 에러
      return res.status(401).send("Invalid Refresh Token");
    }
    return next();
  };
}
