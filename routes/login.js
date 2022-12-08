const express = require('express');
const { Users } = require('../models');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

require('dotenv').config();
const env = process.env;
const router = express.Router();


// Token 발급
let tokenObject = {}; // Refresh Token을 저장할 Object

// 회원 생성
// 암호화 업데이트
router.post("/signup", async (req, res) => {
    try {
        const { nickname, password, confirm } = req.body;
        const IDCheck = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{3,}$/;
        if(!(IDCheck.test(nickname))) {
            res.status(412).json({
                errorMessage: "닉네임의 형식이 일치하지 않습니다.",
            });
            return;
        }
        const existsUsers = await Users.findAll({
            where: { nickname }
        });
        if (existsUsers.length) {
            res.status(400).json({
              errorMessage: "닉네임이 이미 사용중입니다.",
            });
            return;
        }
        if (password !== confirm) {
            res.status(412).json({
              errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
            });
            return;
        }
        if(password.length<4){
            res.status(412).json({
                errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
            return;
        }
        if(password.indexOf(nickname) !== -1) {
            res.status(412).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
            return;
        }
        const pw_hash = crypto.createHash(env.HASH).update(password).digest(env.DIGEST);
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
router.post("/login", async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const pw_hash = crypto.createHash(env.HASH).update(password).digest(env.DIGEST);
        const user = await Users.findOne({
            where: {
                nickname,
                password: pw_hash,
            },
        });
        if(!user) {
            res.status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요."});
            return;
        }
        const accessToken = jwt.sign({userId: user.userId}, env.SECRET_KEY, {expiresIn: '5s'});
        const refreshToken = jwt.sign({},env.SECRET_KEY,{ expiresIn: '7d' });
        tokenObject[refreshToken] = user.userId;  // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
        console.log(tokenObject);
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
        return res.status(200).send({message: "Token이 정상적으로 발급되었습니다."});
    }catch(error) {
        res.status(400).json({ errorMessage: "로그인에 실패하였습니다."});
    }
});

// 로그아웃
// Access Token = null

module.exports = { router, tokenObject };