const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password, bio } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, bio });

    res.status(201).send(user); 
  } catch {
    res.status(500).send("Registration failed");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(" Email not found:", email);
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(" Password match:", isMatch);

    if (!isMatch) return res.status(400).send("Incorrect password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch {
    res.status(500).send("Login error");
  }
});

module.exports = router;
