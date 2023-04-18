- [Node.js - Express + TypeORM + RDS](https://www.notion.so/Node-js-Express-TypeORM-RDS-f4b1fe150fc24b07928d9b7538a6ac31)
- [Node.js - Express + TypeORM + S3 (+ React)](https://www.notion.so/Node-js-Express-TypeORM-S3-React-634c161e81cb4a468d8f924ff2dcff09)
- [Node.js - Express + TypeORM + JWT](https://www.notion.so/Node-js-Express-TypeORM-JWT-a86e2baadff34bfb8aa76f5a7d9cf0db)
- [백엔드 실습 레포](https://github.com/boyon99/Moodlog-BE-WEB/tree/develop)

<br/>

# Express + TypeORM + RDS

## Express란?

Node.js 를 사용해서 REST 서버를 쉽게 구현할 수 있도록 도와주는 프레임워크이다.

#### 설치하기

`npm i express`

#### 세팅하기

```js
// server.js
const express = require("express");
const app = express();

app.get(
  "/", // 접속 시 함수1 실행
  function (req, res, next) {
    // 함수1
    req.body = { id: 1 }; // req 객체 수정
    next(); // 다음 함수 (아래 두번째 함수) 실행
  },
  function (req, res) {
    // 함수2
    res.send(req.body); // 함수1 에서 수정한 req 객체 표시
  }
);

app.get("/posts", function (req, res) {
  res.send("Post Response");
});

app.listen(3000, function () {
  console.log("Express server has started on port 3000");
});
```

파일 생성 후 `node server.js`를 입력하면 서버가 실행된다.

<br/>

### 타입스크립트 환경으로 Express 세팅하기

#### 설치하기

```shell
npm i -D @types/express
npm install -g typescript
```

#### 세팅하기

```json
// tsxonfig.json
{
  "compilerOptions": {
    "lib": ["es5", "es6", "dom"],
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "./dist"
  }
}
```

그 후 `tsc` 명령어를 입력하면 컴파일이 진행된다. `node dist/app.js`를 입력하면 실행된다. 이를 바로 실행할 수 있도록 package.json 의 scripts 부분을 수정한다.

```json
{
  "start": "tsc && node dist/app.js"
}
```

이러면 `npm start` 입력 시 명령어가 바로 실행된다. 그러나 파일 변경 때마다 해당 명령어를 재입력해야 하므로

### 타입스크립트 파일을 자동으로 다시 컴파일하기

#### 설치하기

```shell
npm install -g ts-node nodemon
```

#### 세팅하기

package.json 의 scripts 부분을 수정한다.

```json
{
  "start": "nodemon --exec ts-node src/app.ts",
  "build": "tsc"
}
```

이러면 `npm start` 할 때마다 자동으로 재실행된다.

<br/>

## Typeorm란?

ORM(Object-relational mapping)이란, 관계형 데이터베이스를 사용하는 것에 있어서 객체 지향적인 코드로 데이터베이스를 사용할 수 있도록 도와주는 프레임워크를 의미한다. Typeorm은 Node.js + Typescript 환경에서 대표적으로 활용되는 ORM이다.

이와 함께 RDB 중 하나인 mysql 을 사용해본다.

```shell
npm install typeorm mysql reflect-metadata
```

이 후 ql 데이터베이스와 연결한다. AWS의 RDS 라는 서비스를 이용해본다.

## AWS RDS

> DB 생성하기

DB 생성 후에 DB에 연결한다.

```js
// src/db.ts
import { DataSource } from "typeorm";

const myDataBase = new DataSource({
  type: "mysql",
  host: "db서버 주소",
  port: 3306,
  username: "유저이름",
  password: "비밀번호",
  database: "mydb", // db 이름
  entities: ["src/entity/*.ts"], // 모델의 경로
  logging: true, // 정확히 어떤 sql 쿼리가 실행됐는지 로그 출력
  synchronize: true, // 현재 entity 와 실제 데이터베이스 상 모델을 동기화
});
```

그 후 app.ts에서 DB와 연결한다.

```js
// src/app.ts
import * as express from "express";
import { Request, Response } from "express";
import { myDataBase } from "./db.ts";

// db 연결
myDataBase
  .initialize()
  .then(() => {
    console.log("DataBase has been initialized!");
  })
  .catch((err) => {
    console.error("Error during DataBase initialization:", err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
```

이 후 실행 시 DB에 연결되는 것을 확인할 수 있다.

### 모델 만들기

모델을 만들 때는 클래스를 활용하는데, 해당 클래스 앞에 `@Entity` 와 같이 데코레이터를 명시하면, TypeORM 이 해당 클래스를 하나의 데이터베이스 테이블로서 인식한다.

1. entity 만들기
2. CRUD 만들기
3. Foreign Key를 통해 연결 관계 만들기

> https://github.com/boyon99/express/commit/e3d54aeb5884355595d7aa2ebe54e6b0d7aa28a3

### 파일 구조

- routes 폴더 → 각 자원에 따른 route 파일을 만들고, 해당 route 파일 내부에 post, get 에 따른 함수를 작성
- controllers 폴더 → route 에 들어갈 함수 (db 에 접근하는 로직) 을 따로 분리해서 작성

<br/>

# Express + TypeORM + S3

## multer를 통해 파일 업로드 하기

multer 는 node.js 상에서 파일 업로드를 처리해주는 미들웨어이다.

#### 설치하기

```shell
npm install multer
npm install -D @types/multer
```

#### 세팅하기

```js
// src/upload.ts
import { Request } from "express";
import multer from "multer";

interface DestinationCallback {
  (error: Error | null, destination: string): void;
}
interface FileNameCallback {
  (error: Error | null, filename: string): void;
}

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
```

그 후 최상단에 upload 폴더 생성하기

#### 업로드 api 구현하기

```js
// src/app.ts
import express, { Request, Response } from "express";
import { upload } from "./upload";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/upload", upload.single("img"), (req: Request, res: Response) => {
  res.json(req.file);
}); // 업로드 후에, (req, res) => {} 부분이 실행

app.listen(3001, () => {
  console.log("Express server has started on port 3001");
});
```

<br/>

## S3 활용하기

지금은 업로드한 파일이 서버 컴퓨터에 바로 저장이 되는데, 별도로 파일의 공급과 저장을 담당하는 스토리지 서버를 구성하면 다음과 같은 이점이 있다.

- 파일 공급을 별도의 서버에서 담당하여 트래픽을 분산
- 서버 컴퓨터의 스토리지를 증가시키는 것에 비해 매우 저렴

이를 위해 파일 스토리지 서버로 aws 의 s3 를 사용해본다.

> S3 생성하기

### S3 엑세스키를 발급하기 위해 IAM 활용하기

s3 버킷에 있는 파일을 읽는 것은 서비스 유저들 누구나 할 수 있어야 겠지만, 파일을 업로드하는 것은 접근 권한이 있는 우리 백엔드에서만 할 수 있어야 한다.

> IAM에서 S3 키 발급하기

#### 설치하기

multerS3 는 multer 를 기반으로, 파일 업로드 시에 바로 s3 에 업로드해주는 모듈이다.

```shell
npm install multer-s3 aws-sdk
npm install -D @types/multer-s3
```

#### 세팅하기

```js
// src/uploadS3.ts
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

interface KeyCallback {
  (error: any, key?: string): void;
}

const s3 = new S3Client({
  // aws-sdk 가 제공하는 s3 접속 클라이언트 객체를 만들고,
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: "엑세스 키 아이디", // 방금 발급받은 키를 입력해주세요.
    secretAccessKey: "시크릿 엑세스 키", // 방금 발급받은 키를 입력해주세요.
  },
});
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "버킷 이름", // 방금 생성한 버킷 이름을 입력해주세요.
    acl: "public-read", // 업로드된 파일은 누구나 읽을 수 있게 설정
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: Express.Multer.File, cb: KeyCallback) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
```

### 환경변수 설정하기

**엑세스키**와 같은 민감한 정보는 환경변수 형태로 등록해주는게 좋다.

#### 설치하기

```shell
npm install dotenv
```

#### 세팅하기

```js
// .env
AWS_ACCESS_KEY_ID = 엑세스키아이디;
AWS_SECRET_ACCESS_KEY = 시크릿엑세스키;
```

`process.env.AWS_ACCESS_KEY_ID`를 사용하여 환경변수 적용하기

#### 업로드 api 구현하기

```js
// src/app.ts
import express, { Request, Response } from "express";
import { upload } from "./uploadS3";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/upload", upload.single("img"), (req: Request, res: Response) => {
  res.json(req.file);
}); // 업로드 후에, (req, res) => {} 부분이 실행

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});
```

<br/>

### DB와 함께 사용하기

#### 설치하기

```shell
npm install typeorm mysql reflect-metadata
```

#### 세팅하기

이전에 작성한 `src/db.ts`파일과 동일하다.

1. entity 작성하기
2. controller 작성하기
3. router 작성하기
4. postman 사용하여 테스트하기

> https://github.com/boyon99/express/tree/e0c3227f9ae663ee0b7a63f9b80183327194f401/src

<br/>

# Express + TypeORM + JWT

## JWT

#### 설치하기

```shell
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt
```

#### 구현하기

> https://github.com/boyon99/express/tree/aaf772a5972689a88ee6a718cfb68f58979b887a
