const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const keys = require('../../config/keys')
const User = require('../../models/User')

router.get('/test', (req, res) => {
  res.json({ msg: "This is the users route" });
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email
  const handle = req.body.handle 
  const password = req.body.password

  User.findOne({ email }).then(user => {
    if (user) {
      errors.email = 'There is already a user with that e-mail';
      return res.status(400).json(errors);
    }

    const newUser = new User({
      handle,
      email,
      password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          const payload = { id: user.id, handle }

          jwt.sign(payload, keys.secretOrKey, { expiresIn: 6000 }, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          });
        }).catch(err => {
          console.log(err);
        });
      });
    });
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'There is no account with that e-mail!';
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' });
      } else {
        errors.password = 'Inccorect password';
        return res.status(400).json(errors);
      }
    })
  })
})

module.exports = router;
