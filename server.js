const express = require('express')
const app = express()

// app.method(주소, 실행할 함수)

app.get('/', function (req, res) {
  console.log('start') // 응답을 보내야 한다. console.log는 응답이 아니다.
  res.send('hello world')
})

app.get('/post', function (req, res, next) {
  // 인증되었는지 확인하는 함수
  req.body = { id: 1 }
  next() // 다음 함수를 진행하려면 next()함수를 반드시 사용해야 한다.
}, function (req, res) {
  // 인증되었다면 응답을 내려주는 함수
  // 이전 함수에서의 값을 전달받는다.
  res.send(req.body) // {id:1}
})

app.listen(2000, function () {
  console.log('express server started on port 2000')
})

