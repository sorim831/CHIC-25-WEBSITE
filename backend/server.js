// backend/server.js

require("dotenv").config(); // 환경변수 로드
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoute"); // 인증 라우트 불러오기
const userApprovalRoutes = require("./routes/userApprovalRoute");
const postRoutes = require("./routes/postRoute");
const replyRoutes = require("./routes/replyRoute");
const calendarRoutes = require("./routes/calendarRoute");
const db = require("./config/db"); // DB 연결 모듈 불러오기
const app = express();
const path = require("path"); // path 모듈 추가

const cors = require("cors");
// CORS 설정
app.use(cors()); // 모든 출처를 허용

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", postRoutes); // 게시글 라우트 추가
app.use("/replies", replyRoutes); // 댓글 라우트 추가
app.use("/calendar", calendarRoutes);// 캘린더 라우트 추가가

// // 뷰 엔진 설정
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views")); // views 폴더 경로 설정

// 정적 파일 설정 (public 폴더)
app.use(express.static(path.join(__dirname, "public")));

// 라우팅 설정
app.use("/", authRoutes); // 인증 관련 라우트
app.use("/user-approval", userApprovalRoutes); // 관리자 승인 라우트트

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("서버 오류:", err);
  res.status(500).send("서버에서 오류가 발생했습니다(server.js).");
});

// DB 연결
db.connect();

// 서버 실행
const port = process.env.PORT || 5000; // 포트 설정
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
  console.log(process.env.MONGODB_URI);
});
