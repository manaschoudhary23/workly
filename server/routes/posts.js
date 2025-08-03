const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.send(posts);
});

router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.create({
      content,
      author: req.user.id,
    });

    res.status(201).send(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Server error while creating post");
  }
});

router.post("/:id/comment", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    user: req.user.id,
    text: req.body.text,
  });
  await post.save();
  res.status(201).send(post);
});

router.get("/me", auth, async (req, res) => {
  const posts = await Post.find({ author: req.user.id }).sort("-createdAt");
  res.send(posts);
});


router.get("/user/:id", async (req, res) => {
  const posts = await Post.find({ author: req.params.id }).sort("-createdAt");
  res.send(posts);
});

module.exports = router;
