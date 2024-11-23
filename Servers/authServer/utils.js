// utils

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createConnection = require('../../api/config/database');
const dbConnection = createConnection();

// Generate access token
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Save refresh token to the database with expiration time
async function saveRefreshToken(userId, token) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // Token expires in 1 day
  const sql = 'INSERT INTO RefreshTokens (UserID, Token, ExpiresAt) VALUES (?, ?, ?)';
  await dbConnection.query(sql, [userId, token, expiresAt]);
}

// Check if the refresh token exists and is not expired
async function tokenExists(token) {
  const sql = 'SELECT Token, ExpiresAt FROM RefreshTokens WHERE Token = ?';
  const [results] = await dbConnection.query(sql, [token]);

  // If no token is found or the token has expired, return false
  if (results.length === 0 || new Date(results[0].ExpiresAt) < new Date()) {
      return false; // Token doesn't exist or it is expired
  }

  return true; // Token exists and hasn't expired
}
// Delete refresh token from the database
async function deleteRefreshToken(token) {
    const sql = 'DELETE FROM RefreshTokens WHERE Token = ?';
    await dbConnection.query(sql, [token]);
}

// Remove expired refresh token from the database
async function deleteExpiredTokens() {
  const sql = 'DELETE FROM RefreshTokens WHERE ExpiresAt < NOW()';
  await dbConnection.query(sql);
}

// Compare password hash
async function comparePassword(plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword);
}

// Hash a password
async function hashPassword(password) {
    return bcrypt.hash(password, 10); // 10 is the salt rounds
}

module.exports = {
    generateAccessToken,
    saveRefreshToken,
    tokenExists,
    deleteRefreshToken,
    comparePassword,
    hashPassword
};