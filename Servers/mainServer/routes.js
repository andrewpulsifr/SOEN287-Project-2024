const express = require('express');
const { authenticateToken } = require('./middleware');

const router = express.Router();
const posts = [
  { username: 'Kyle', title: 'Post 1' },
  { username: 'Jim', title: 'Post 2' },
];

router.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

module.exports = router;
