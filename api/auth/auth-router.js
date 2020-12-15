const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secrets');

const User = require('../users/user-model');
const { isValid } = require('./../users/user-service');

router.post('/register', (req, res) => {
  const credentials = req.body;

  if(isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 7;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    User.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if(isValid(req.body)) {
    User.findBy({ username: username })
      .then(([user]) => {
        if(user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);
          res.status(200).json({
            message: `OMG its you! Hey ${user.username}`, token,
          })
        } else {
          res.status(401).json({ message: 'You didn\'t say the magic word!' })
        }
      })
      .catch(e => {
        res.status(500).json({ message: e.message });
      })
  } else {
    res.status(400).json({ message: 'invalid credentials' })
  }
})

function makeToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    department: user.department
  }
  const options = {
    expiresIn: '1000s'
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;