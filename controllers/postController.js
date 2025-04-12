const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const posts = await Post.find()
            .populate('auther', 'fullName')
            .limit(parseInt(limit))
            .skip((page - 1) * limit);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            auther: req.user.id,
            tags: req.body.tags
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        if (title) res.post.title = title;
        if (content) res.post.content = content;
        if (tags) res.post.tags = tags;
        const updatedPost = await res.post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await res.post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        res.post.comments.push({ text, auther: req.user.id });
        await res.post.save();
        res.status(201).json(res.post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};