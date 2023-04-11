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

## typeorm

관계형 데이터베이스에서 SQL 언어를 쉽게 사용할 수 있게 지원하는 프레임워크이다.

## aws RDS

`npm i typeorm mysql reflect-metadata`

설치 후 db.ts 파일 생성하여 세팅하기

- app.ts 에서 DB 연결하기
