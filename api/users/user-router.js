const router = require('express').Router();

const User = require('./user-model');
const restricted = require('./../auth/restricted-middleware');

router.get('/', restricted, (req, res) => {
  User.find()
    .then(users => {
      res.status(201).json(users)
    }) 
    .catch(e => {
      res.status(401).json({ message: e.message });
    })
})

module.exports = router;