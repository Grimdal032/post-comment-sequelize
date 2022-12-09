const express = require('express');
const router = express.Router();

const PostRouter = require('./posts.js');
const CommentRouter = require('./comments.js');
const UserRouter = require('./users.js');
const { router: LoginRouter } = require('./login.js');

router.use('/posts', PostRouter);
router.use('/comments', CommentRouter);
router.use('/users', UserRouter);
router.use('/', LoginRouter);

module.exports = router;
