# express + aws

## express

`npm i express`

- https://github.com/boyon99/express/commit/9b477be59866e738c172f0dc717ed832686ce0a8

입력 후 node server.js 입력 하면 서버가 구동된다.

- https://github.com/boyon99/express/commit/e4ca4da3f222470996574cec7f820c12f6a8cf00

하나의 요청에서 여러 함수 사용하기

`npm i @types/express`

타입스크립트로 사용하기

- tsconfig.json 파일 작성하기

`npm i -g typescript`

입력 후 `tsc`입력 하면 dist 폴더에 변환된 파일이 생성된다. 그리고 `node dist/app.js`를 입력하면 서버가 실행된다.

- package.json 작성하기

```json
{
  "start": "tsc && node dist/app.js"
}
```

를 작성하고 npm start 입력 시 명령어 실행된다. 그러나 파일이 변경되면 바로 되지는 않음.

`npm i -g ts-node nodemon`

변경 시 자동으로 반영된 서버가 실행되도록 해주는 것.

- package.json 수정하기

```json
{
  "start": "nodemon --exec ts-node src/app.ts"
}
```

npm start 입력 시 자동으로 실행된다.

## aws RDS

`npm i typeorm mysql reflect-metadata`

> typeorm는 관계형 데이터베이스에서 SQL 언어를 쉽게 사용할 수 있게 지원하는 프레임워크이다.

설치 후 db.ts 파일 생성하여 세팅하기

- app.ts 에서 DB 연결하기

- 모델을 만들기 위한 entity 폴더 생성하기

> https://github.com/boyon99/express/tree/e3d54aeb5884355595d7aa2ebe54e6b0d7aa28a3

## aws S3

`npm i multer`
`npm install -D @types/multer`

`multer` 는 node.js 상에서 파일 업로드를 처리해주는 미들웨어입니다.

- src/upload.ts 파일에 설정하기

> 커밋

- app.ts에 관련 코드 작성하고 upload 폴더 생성 후 POST 요청하면 이미지 업로드됨

> 커밋

- S3 기능 이용하기
  aws에서는 서비스를 사용하기 위한 key라는 것이 존재한다. 그리고 계정에서 특정한 서비스만 사용할 수 있도록 설정해놓고 발급하는 키가 존재한다. 후자를 발급하는 곳이 **iam**이다.

- iam에서 S3 키 발급받기

`npm i multer-s3 aws-sdk`
`npm i -D @types/multer-s3`

- uploadS#.ts 파일 작성하기

> 커밋

`npm install dotenv`

엑세스키와 같은 민감한 정보는 환경변수 형태로 등록해주는게 좋다.

> 커밋 2

`npm install typeorm mysql reflect-metadata`

- db.ts 파일 추가하기

- entity 파일 생성하여 모델 추가하기
