const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load user model
const User = require("../../models/User");

// @routes  Get api/''/test
// @desc    Tests routes
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @routes  Get api/''/register
// @desc    Register a User
// @access  Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exist!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @routes  Get api/''/login
// @desc    Login User/ Return JWT token
// @access  Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    //Check for User
    if (!user) {
      return res.status(404).json({ email: "User not found!" });
    }

    //Check for password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "SUCCESS" });
      } else {
        return res.status(404).json({ password: "Password Incorrect" });
      }
    });
  });
});

module.exports = router;
