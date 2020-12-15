const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

const authRouter = require('./auth/auth-router');
const userRouter = require('./users/user-router');

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/user', userRouter);

server.get('/', (re11, res) => {
  res.json('You get nothing.')
})

module.exports = server;