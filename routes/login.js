const express = require('express');
const { Users } = require('../models');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const router = express.Router();
const PostRouter = require('./posts.js');
const CommentRouter = require('./comments.js');
const UserRouter = require('./users.js');

router.use('/posts', [PostRouter]);
router.use('/comments', [CommentRouter]);
router.use('/users', [UserRouter]);


// 회원 생성
// 암호화 업데이트
router.post("/signup", async (req, res) => {
    try {
        const { nickname, password, confirm } = req.body;
        // 3. #412 닉네임 형식이 비정상적인 경우
        // 최소 3자 이상, 알파벳 대소문자(a-z, A-Z), 숫자 (0-9)로 구성
        // 둘 중 하나라도 false가 검출되면 true로 변경해서 에러 리턴
        // https://newehblog.tistory.com/54
        const IDCheck = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{3,}$/;
        if(!(IDCheck.test(nickname))) {
            res.status(412).json({
                errorMessage: "닉네임의 형식이 일치하지 않습니다.",
            });
            return;
        }
        // 1. #412 닉네임이 중복된 경우
        const existsUsers = await Users.findAll({
            where: { nickname }
        });
        if (existsUsers.length) {
            res.status(400).json({
              errorMessage: "닉네임이 이미 사용중입니다.",
            });
            return;
        }
        // 2. #412 비밀번호가 일치하지 않는 경우
        if (password !== confirm) {
            res.status(412).json({
              errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
            });
            return;
        }
        // 4. #412 password 형식이 비정상적인 경우
        // 비밀번호는 최소 4자 이상이며
        if(password.length<4){
            res.status(412).json({
                errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
            return;
        }
        // 5. #412 password에 닉네임이 포함되어 있는 경우
        if(password.indexOf(nickname) !== -1) {
            res.status(412).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
            return;
        }
        // npm i crypto-js
        // base64는 해시값이 짧아서 많이 쓴다고함
        const pw_hash = crypto.createHash(HASH).update(password).digest(DIGEST);
        const createUser = await Users.create({ 
            nickname, 
            password: pw_hash
        });
        res.status(201).json({ message: `회원 가입에 성공하였습니다.` });
    } catch (error) {
        console.error(error);
        res.status(400).json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
    }
});

// 로그인
// 암호화 업데이트
router.post("/login", async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const pw_hash = crypto.createHash(HASH).update(password).digest(DIGEST);
        const user = await Users.findOne({
            where: {
                nickname,
                password: pw_hash,
            },
        });
        // 로그인 검사가 실패했을 경우
        if(!user) {
            res.status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요."});
            return;
        }
        res.cookie('accessToken', createAccessToken(user.userId));
        res.cookie('refreshToken', createRefreshToken());
        return res.status(200).send({message: "Token이 정상적으로 발급되었습니다."});
    }catch(error) {
        res.status(400).json({ errorMessage: "로그인에 실패하였습니다."});
    }
});

// 로그아웃
// Access Token = null

// Access Token을 생성합니다.
function createAccessToken(userId) {
    const accessToken = jwt.sign(
      { userId: userId }, // JWT 데이터
      SECRET_KEY, // 비밀키
      { expiresIn: '10m' }) // Access Token이 10초 뒤에 만료되도록 설정합니다.
    return accessToken;
};

// Refresh Token을 생성합니다.
function createRefreshToken() {
    const refreshToken = jwt.sign(
      {}, // JWT 데이터
      SECRET_KEY, // 비밀키
      { expiresIn: '7d' }) // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  
    return refreshToken;
};
module.exports = router;