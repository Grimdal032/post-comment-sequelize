const express = require('express');
const { Comments } = require("../models");
const authMiddleware = require("../middleware/auth-middleware.js");

const router = express.Router();

// 댓글 목록 조회
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.findAll({
            where: {postId},
            attributes: [ 'commentId', 'userId', 'nickname', 'comment', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({data: comments});
    } catch (err) {
        return res.status(400).json({ errorMessage : "댓글 조회에 실패하였습니다."});
    }
});

// 댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        if(comment === null) {
            return res.status(412).json({ errorMessage: "댓글 내용을 입력해주세요."});
        }
        const { user }= res.locals;
        const { userId, nickname } = user;
        const createdComment = await Comments.create({ postId, userId, nickname, comment });
        res.status(200).json({ message: "댓글을 작성하였습니다." });
    } catch (error) {
        return res.status(400).json({ errorMessage : "댓글 작성에 실패하였습니다."});
    }
});

// 댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        const existComment = await Comments.findOne({where: {commentId: commentId}});

        if(existComment !== null) {
            if(comment === undefined) { 
                return res.status(400).json({errorMessage: "댓글 수정이 정상적으로 처리되지 않았습니다."});
            }
            await Comments.update({comment}, {where: {commentId: commentId}});
            return res.status(200).json({message: "댓글을 수정하였습니다."})
        }else {
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."});
        }
    } catch (error) {
        return res.status(400).json({errorMessage: "댓글 수정에 실패하였습니다."});
    }
});

// 댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const existComment = await Comments.findOne({where: {commentId: commentId}});
        if(existComment !== null) {
            await Comments.destroy({where: {commentId: commentId}});
            return res.status(200).json({message: "댓글을 삭제하였습니다."})
        }else {
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."});
        }
    } catch (error) {
        return res.status(400).json({errorMessage: "댓글 삭제에 실패하였습니다."});
    }
});

module.exports = router;