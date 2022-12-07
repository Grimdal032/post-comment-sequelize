const express = require('express');
const { Users, Comments, Posts, Likes, sequelize } = require("../models");
const authMiddleware = require("../middleware/auth-middleware.js");
const router = express.Router();

// ==============================
//              조건
// 1. 로그인 토큰 없이 접근 가능
// - 게시글 조회
// - 게시글 목록 조회
// 2. 로그인 토큰 있어야 접근 가능
// - 게시글 작성
// - 게시글 수정
// - 게시글 삭제
// ==============================

// 게시글 목록 조회
router.get("/", async (req, res) => {
    try{
        const posts = await Posts.findAll({
            attributes: [ 'postId', 'userId', 'nickname', 'title', 'createdAt', 'updatedAt', 'likes'],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({data: posts}); 
    }catch(error) {
        res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."});
    }
});

// 게시글 작성
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { user }= res.locals;
        const { userId, nickname } =  user;
        if(title === null || content === null) {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다."});
        }
        // 이해 못함
        // # 412 Title의 형식이 비정상적인 경우
        // {"errorMessage": "게시글 제목의 형식이 일치하지 않습니다."}
        // # 412 Content의 형식이 비정상적인 경우
        // {"errorMessage": "게시글 내용의 형식이 일치하지 않습니다."}
        const likes = 0;
        const createdPosts = await Posts.create({ userId, nickname, title, content, likes });

        res.status(200).json({ message: "게시글을 작성에 성공하였습니다." });
    } catch (error) {
        return res.status(400).json({ errorMassage : "게시글 작성에 실패하였습니다."});
    }
});

// 게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
    try { 
        const { postId } = req.params;
        const { title, content } = req.body;
        if(title === null || content === null) {
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
        }
        // 모르겠음
        // # 412 Title의 형식이 비정상적인 경우
        // {"errorMessage": "게시글 제목의 형식이 일치하지 않습니다."}
        // # 412 Content의 형식이 비정상적인 경우
        // {"errorMessage": "게시글 내용의 형식이 일치하지 않습니다."}
        // # 401 게시글 수정이 실패한 경우
        // {"errorMessage": "게시글이 정상적으로 수정되지 않았습니다.”}
        await Posts.update({title, content}, {where: {postId: postId}});
        return res.status(200).json({message: "게시글을 수정하였습니다."});
    } catch (error) {
        return res.status(400).json({errorMessage: "게시글 수정에 실패하였습니다."});
    }
});

// 게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
    try { 
        const { postId } = req.params;
        const existPost = await Posts.findOne({where: {postId: postId}});
        if(existPost === null) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        }
        await Posts.destroy({where: {postId: postId}});
        return res.status(200).json({message: "게시글 삭제 완료"});
    } catch (error) {
        return res.status(400).json({errorMessage: "게시글 삭제에 실패하였습니다."});
    }
});

// 게시글 좋아요
router.put("/:postId/like", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const existPost = await Posts.findOne({where: {postId: postId}});
        if(existPost === null) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다."});
        }
        const { user }= res.locals;
        const { userId } = user;
        const existLike = await Likes.findOne({where: {postId: postId, userId: userId}});
        if(existLike === null) {    // Like가 존재하지 않으면 좋아요 추가
            const likes = existPost.likes + 1;
            await Posts.update({ likes }, {where: {postId: postId}});
            await Likes.create({ postId, userId });
            return res.status(200).json({message: "게시글의 좋아요를 등록하였습니다."});
        }else { // 이미 Like가 존재하는 경우 좋아요 취소
            const { likeId } = existLike; 
            const likes = existPost.likes - 1;
            await Posts.update({ likes }, {where: {postId: postId}});
            await Likes.destroy({where: { likeId }});
            return res.status(200).json({message: "게시글의 좋아요를 취소하였습니다."});
        }
    }catch(error) {
        return res.status(400).json({ errorMessage: "게시글 좋아요에 실패하였습니다."});
    }
});

// 좋아요 게시글 조회
router.get("/like", authMiddleware, async (req, res) => {
    try{
        const { user } = res.locals;
        const { userId } = user;
        const likes = await Likes.findAll({
            attributes: ['postId', 'userId', 'createdAt', 'updatedAt'],
            where: {userId},
            include: [{ model: Posts , attributes: ['title', 'likes', 'nickname']}],
        });
        const result = likes.map((e) => ({
            postId : e.dataValues.postId,
            userId : e.dataValues.userId,
            nickname : e.dataValues.Post.dataValues.nickname,
            title : e.dataValues.Post.dataValues.title,
            createdAt : e.dataValues.createdAt,
            updatedAt : e.dataValues.updatedAt,
            likes : e.dataValues.Post.dataValues.likes
        }));
        res.status(200).json({data: result});
    }catch(error){
        return res.status(400).json({errorMessage: "좋아요 게시글 조회에 실패하였습니다."});
    }
});

// 게시글 상세 조회
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Posts.findOne({
            where: { postId },
            include: [ Comments ],
        });
        res.status(200).json({data : post});
    } catch (err) {
        return res.status(400).json({ errorMessage : "게시글 조회에 실패하였습니다."});
    }
});

module.exports = router;