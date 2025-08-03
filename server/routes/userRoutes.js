const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

module.exports = router;
