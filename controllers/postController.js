const Post = require("../models/Post");

// Create a post
module.exports.createPost = async (req, res) => {
    try {

        const { title, content } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).send({
                message: "Title and content are required"
            });
        }

        const newPost = new Post({
            title,
            content,
            author: req.user.userId
        });

        await newPost.save();

        const post = await Post.findById(newPost._id)
            .populate("author", "username");

        return res.status(201).send({
            message: "Post created successfully",
            post
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Update a post
module.exports.updatePost = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, content } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).send({
                message: "Title and content are required"
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // Check if user owns the post
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).send({
                message: "You are not allowed to update this post"
            });
        }

        post.title = title;
        post.content = content;

        await post.save();

        return res.status(200).send({
            message: "Post updated successfully",
            post
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Get all posts
module.exports.getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            posts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Get logged-in user's posts
module.exports.getMyPosts = async (req, res) => {
    try {

        console.log("Logged in user:", req.user);

        const posts = await Post.find({
            author: req.user.userId
        })
        .populate("author", "username email")
        .sort({ createdAt: -1 });

        return res.status(200).send({
            posts
        });

    } catch (error) {

        console.error("GET MY POSTS ERROR:", error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Get single post
module.exports.getPost = async (req, res) => {
    try {

        const { id } = req.params;

        const post = await Post.findById(id)
            .populate("author", "username email");

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        return res.status(200).send({
            post
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};

// Delete a post
module.exports.deletePost = async (req, res) => {
    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // Allow owner or admin to delete
        if (
            post.author.toString() !== req.user.userId &&
            !req.user.isAdmin
        ) {
            return res.status(403).send({
                message: "You are not allowed to delete this post"
            });
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).send({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};