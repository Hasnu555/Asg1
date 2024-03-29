const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authmiddleware');

const router = Router();

const postController = require('../controller/postController');
const commentController = require('../controller/commentController');

// Routes for creating, retrieving, updating, and deleting posts
router.get('/social', requireAuth, postController.showPosts);
router.post('/social', requireAuth, postController.createPost);
router.put('/social/:id', requireAuth, postController.updatePost);//user id
router.delete('/social/:id', requireAuth, postController.deletePost);//user id

// Routes for comments
router.post('/social/:postId/comments', requireAuth, commentController.createComment);
router.get('/social/:postId/comments', requireAuth, commentController.getCommentsByPostId);
router.put('/social/comments/:commentId', requireAuth, commentController.updateComment);
router.delete('/social/comments/:commentId', requireAuth, commentController.deleteComment);


// Routes for likes
router.post('/social/:postId/like', requireAuth, postController.likePost);
router.delete('/social/:postId/like', requireAuth, postController.unlikePost);

// Routes for creating, retrieving, updating, and deleting posts within a group
router.get('/groups/:groupId/posts', requireAuth, postController.showPostsInGroup);
router.post('/groups/:groupId/posts', requireAuth, postController.createPostInGroup);
router.put('/groups/:groupId/posts/:postId', requireAuth, postController.updatePostInGroup);
router.delete('/groups/:groupId/posts/:postId', requireAuth, postController.deletePostInGroup);

// Routes for comments on posts within a group
router.post('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.createCommentInGroup);
router.get('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.getCommentsByPostIdInGroup);
router.put('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.updateCommentInGroup);
router.delete('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.deleteCommentInGroup);

// Routes for liking/unliking posts within a group
router.post('/groups/:groupId/posts/:postId/like', requireAuth, postController.likePostInGroup);
router.delete('/groups/:groupId/posts/:postId/like', requireAuth, postController.unlikePostInGroup);

// Routes for creating, retrieving, updating, and deleting posts within a group
router.get('/groups/:groupId/posts', requireAuth, postController.showPostsInGroup);
router.post('/groups/:groupId/posts', requireAuth, postController.createPostInGroup);
router.put('/groups/:groupId/posts/:postId', requireAuth, postController.updatePostInGroup);
router.delete('/groups/:groupId/posts/:postId', requireAuth, postController.deletePostInGroup);

// Routes for comments on posts within a group
router.post('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.createCommentInGroup);
router.get('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.getCommentsByPostIdInGroup);
router.put('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.updateCommentInGroup);
router.delete('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.deleteCommentInGroup);

// Routes for liking/unliking posts within a group
router.post('/groups/:groupId/posts/:postId/like', requireAuth, postController.likePostInGroup);
router.delete('/groups/:groupId/posts/:postId/like', requireAuth, postController.unlikePostInGroup);

// Routes for creating, retrieving, updating, and deleting posts within a group
router.get('/groups/:groupId/posts', requireAuth, postController.showPostsInGroup);
router.post('/groups/:groupId/posts', requireAuth, postController.createPostInGroup);
router.put('/groups/:groupId/posts/:postId', requireAuth, postController.updatePostInGroup);
router.delete('/groups/:groupId/posts/:postId', requireAuth, postController.deletePostInGroup);

// Routes for comments on posts within a group
router.post('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.createCommentInGroup);
router.get('/groups/:groupId/posts/:postId/comments', requireAuth, commentController.getCommentsByPostIdInGroup);
router.put('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.updateCommentInGroup);
router.delete('/groups/:groupId/posts/comments/:commentId', requireAuth, commentController.deleteCommentInGroup);

// Routes for liking/unliking posts within a group
router.post('/groups/:groupId/posts/:postId/like', requireAuth, postController.likePostInGroup);
router.delete('/groups/:groupId/posts/:postId/like', requireAuth, postController.unlikePostInGroup);



module.exports = router;
