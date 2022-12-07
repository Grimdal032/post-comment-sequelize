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
        //auth 에서 유저 정보 받아올 것
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

        // 모르겠음
        // # 412 body 데이터가 정상적으로 전달되지 않는 경우
        // {"errorMessage": "데이터 형식이 올바르지 않습니다."}
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
// idea - 아예 삭제 보다는 "삭제된 댓글입니다" 를 넣는 것이 더 낫지 않을까?
router.delete("/:commentId", authMiddleware, async (req, res) => {
    try {
        // 모르겠음
        // # 400 댓글 삭제에 실패한 경우
        // {"errorMessage": "댓글 삭제가 정상적으로 처리되지 않았습니다.”}
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