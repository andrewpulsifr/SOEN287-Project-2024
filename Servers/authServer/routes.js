const express = require('express');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('./utils');
const db = require('./db');

const router = express.Router();

// Store a refresh token in the database
function saveRefreshToken(token, userId, callback) {
  const sql = 'INSERT INTO RefreshToken (Token, UserID) VALUES (?, ?)';
  db.query(sql, [token, userId], (err, results) => {
      if (err) {
          console.error('Error saving refresh token:', err.message);
          return callback(err);
      }
      console.log('Refresh token saved:', results);
      callback(null);
  });
}


// Verify if a refresh token exists in the database
function tokenExists(token, callback) {
  const sql = 'SELECT token FROM RefreshTokens WHERE token = ?';
  db.query(sql, [token], (err, results) => {
      if (err) return callback(err, false);
      callback(null, results.length > 0);
  });
}

// Remove a refresh token from the database
function deleteRefreshToken(token, callback) {
  const sql = 'DELETE FROM RefreshTokens WHERE token = ?';
  db.query(sql, [token], callback);
}

// Endpoints
router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  tokenExists(refreshToken, (err, exists) => {
      if (err) return res.sendStatus(500);
      if (!exists) return res.sendStatus(403);

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken({ name: user.name });
          res.json({ accessToken });
      });
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  saveRefreshToken(refreshToken, (err) => {
      if (err) return res.sendStatus(500);
      res.json({ accessToken, refreshToken });
  });
});

router.delete('/logout', (req, res) => {
  const token = req.body.token;
  deleteRefreshToken(token, (err) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(204);
  });
});


module.exports = router;
