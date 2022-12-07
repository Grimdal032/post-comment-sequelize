const { Users } = require("../models");
const express = require("express");
const app = express();

const SECRET_KEY = 'secret-key';
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    if (!req.cookies.refreshToken) return res.status(400).json({ "message": "Refresh Token이 존재하지 않습니다." });
    if (!req.cookies.accessToken) return res.status(400).json({ "message": "Access Token이 존재하지 않습니다." });
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;


    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = validateRefreshToken(refreshToken);

    if (!isRefreshTokenValidate) return res.status(419).json({ "message": "Refresh Token이 만료되었습니다." });

    // AccessToken 이 만료되었을 경우 새로 발급
    if (!isAccessTokenValidate) {
        const accessTokenId = tokenObject[refreshToken];
        if (!accessTokenId) return res.status(419).json({ "message": "Refresh Token의 정보가 서버에 존재하지 않습니다." });

        const newAccessToken = createAccessToken(accessTokenId);
        res.cookie('accessToken', newAccessToken);
        return res.json({ "message": "Access Token을 새롭게 발급하였습니다." });
    }

    // secretKey 값이 틀렸을 경우 서버가 종료되기 때문에 try-catch 사용
    try{
        // 실제 jwt 토큰 유효성 검증 - 복호화
        const { userId } = getAccessTokenPayload(accessToken);
        const user = await Users.findOne({where:{userId}});
        res.locals.user = user.dataValues;
        next();
    }catch(error) {
        res.status(400).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
}

// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
    try {
      jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
};
  
// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
    try {
      jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
};

  // Access Token을 생성합니다.
function createAccessToken(userId) {
    const accessToken = jwt.sign(
      { userId: userId }, // JWT 데이터
      SECRET_KEY, // 비밀키
      { expiresIn: '10m' }) // Access Token이 10초 뒤에 만료되도록 설정합니다.
    return accessToken;
};

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
      return payload;
    } catch (error) {
      return null;
    }
};