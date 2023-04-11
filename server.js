const express = require('express')
const app = express()

// app.method(주소, 실행할 함수)

app.get('/', function (req, res) {
  console.log('start') // 응답을 보내야 한다. console.log는 응답이 아니다.
  res.send('hello world')
})

app.listen(2000, function () {
  console.log('express server started on port 2000')
})

