import express from 'express';
import PostController from '../controllers/post/post.controller';
import UserController from '../controllers/user/user.controller';

const router = express.Router();

// 게시글
router.post('/post', PostController.createBlogPost);

// 유저
// router.get('/user', UserController.getUser);
router.post('/user', UserController.createUser);

// router.post('/createPostAndComments', PostController.createPostAndComments);
// router.get('/getall', PostController.getBlogPosts);
// router.get('/get/:id', PostController.getBlogPost);
// router.put('/update/:id', PostController.updateBlogPost);
// router.delete('/delete/:id', PostController.deleteBlogPost);
// router.delete('/deleteall', PostController.deleteAllBlogPosts);
// router.post('/like', PostController.likeBlogPost);

export default router;
