const { Users } = require("../models");
require('dotenv').config();
const env = process.env;
const jwt = require("jsonwebtoken");
let {tokenObject} = require("../routes/login.js");

module.exports = async (req, res, next) => {
  try {
    if (!req.cookies.refreshToken) return res.status(400).json({ "message": "Refresh Token이 존재하지 않습니다." });
    if (!req.cookies.accessToken) return res.status(400).json({ "message": "Access Token이 존재하지 않습니다." });
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // 검증
    const isAccessTokenValidate = function() {
      try{
        jwt.verify(accessToken, env.SECRET_KEY);
        return true;
      }catch(error) {
        return false;
      }
    };
    const isRefreshTokenValidate = function() {
      try{
        jwt.verify(refreshToken, env.SECRET_KEY);
        return true;
      }catch(error) {
        return false;
      }
    }
    if (!isRefreshTokenValidate) return res.status(419).json({ "message": "Refresh Token이 만료되었습니다." });
    // AccessToken 이 만료되었을 경우 새로 발급
    if (!isAccessTokenValidate()) {
        const accessTokenId = tokenObject[refreshToken];
        if (!accessTokenId) return res.status(419).json({ "message": "Refresh Token의 정보가 서버에 존재하지 않습니다." });
        
        const newAccessToken = jwt.sign({userId: accessTokenId}, env.SECRET_KEY, {expiresIn: '10m'});
        console.log(newAccessToken);
        res.cookie('accessToken', newAccessToken);
        return res.json({ "message": "Access Token을 새롭게 발급하였습니다." });
    }

    // secretKey 값이 틀렸을 경우 서버가 종료되기 때문에 try-catch 사용
    try{
        // 실제 jwt 토큰 유효성 검증 - 복호화
        const { userId } = jwt.verify(accessToken, env.SECRET_KEY);
        const user = await Users.findOne({where:{userId}});
        res.locals.user = user.dataValues;
        next();
    }catch(error) {
        res.status(400).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
  }catch(error) {
    return res.status(400).json({errorMessage: "알 수 없는 에러 발생!"});
  }
}
