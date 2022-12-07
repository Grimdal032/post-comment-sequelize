const express = require('express');
const { Users } = require("../models");

const router = express.Router();

// 회원 목록 조회
router.get("/", async (req, res) => {
    try {
        const users = await Users.findAll({});
        res.status(200).json({ "data" : users });
    }catch(err) {
        return res.status(400).json({ errorMessage : "회원 목록 조회 실패"});
    }
});

// 회원 상세 조회
router.get("/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await Users.findOne({_id: userid});
        res.status(200).json({ result: {
            userId: user._id,
            name: user.name,
            ID: user.ID,
            pw: user.pw
        }});
    } catch (err) {
        return res.status(400).json({ message : "회원 상세 조회 실패"});
    }
});

module.exports = router;