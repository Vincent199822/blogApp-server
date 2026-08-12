const express = require("express");
const router = express.Router();

const {
    getAllPosts,
    getMyPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

const { verify } = require("../auth");

// Public routes
router.get("/", getAllPosts);

// My Posts - MUST come before /:id
router.get("/my-posts", verify, getMyPosts);

// Single Post
router.get("/:id", getPost);

// Protected routes
router.post("/", verify, createPost);
router.put("/:id", verify, updatePost);
router.delete("/:id", verify, deletePost);

module.exports = router;