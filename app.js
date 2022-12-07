const express = require('express');
const cookieParser = require("cookie-parser");
const routes = require('./routes/login.js');
const app = express();
const port = 3011;

// 정적 파일을 서빙함, 전역 미들웨어
app.use(express.static("assets"));
app.use(express.json());
app.use(cookieParser());

// 입력값이 잘못된 경우 404 페이지 보여주는 경우를 처리
app.use((error, req, res, next) => {
  if(error instanceof SyntaxError)
    response.status(404).send("your error message");
  else next();
});

const { response } = require('express');
app.use("/api", routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});