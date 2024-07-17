const app = require("./index");

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`포트 ${port}에서 서버가 실행 중입니다`));
