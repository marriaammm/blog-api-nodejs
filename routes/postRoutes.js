const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticate, authorize } = require('../middleware/auth');
const { postValidation } = require('../middleware/validation');
const postController = require('../controllers/postController');

// Middleware to check ownership
async function getPostAndCheckOwnership(req, res, next) {
    try {
        const post = await Post.findById(req.params.id).populate('auther', 'role');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if (post.auther.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden. Not the author or admin.' });
        }
        
        res.post = post;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

router.post('/:id/comments', authenticate, getPostAndCheckOwnership, postController.addComment);

// Routes
router.get('/', postController.getPosts);
router.post('/', authenticate, postValidation, postController.createPost);
router.put('/:id', authenticate, postValidation, getPostAndCheckOwnership, postController.updatePost);
router.delete('/:id', authenticate, getPostAndCheckOwnership, postController.deletePost);

module.exports = router;