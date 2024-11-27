// utils

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createConnection from '../../api/config/database.js'; // Ensure the path is correct

const dbConnection = createConnection();
// Generate access token
export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
}

// Save refresh token to the database with expiration time
export async function saveRefreshToken(userId, token) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // Token expires in 1 day
  const sql = 'INSERT INTO RefreshTokens (UserID, Token, ExpiresAt) VALUES (?, ?, ?)';
  await dbConnection.query(sql, [userId, token, expiresAt]);
}

// Check if the refresh token exists and is not expired
export async function tokenExists(token) {
  const sql = 'SELECT Token, ExpiresAt FROM RefreshTokens WHERE Token = ?';
  const [results] = await dbConnection.query(sql, [token]);

  // If no token is found or the token has expired, return false
  if (results.length === 0 || new Date(results[0].ExpiresAt) < new Date()) {
      return false; // Token doesn't exist or it is expired
  }

  return true; // Token exists and hasn't expired
}
// Delete refresh token from the database
export async function deleteRefreshToken(token) {
    const sql = 'DELETE FROM RefreshTokens WHERE Token = ?';
    await dbConnection.query(sql, [token]);
}

// Remove expired refresh token from the database
export async function deleteExpiredTokens() {
  const sql = 'DELETE FROM RefreshTokens WHERE ExpiresAt < NOW()';
  await dbConnection.query(sql);
}

// Compare password hash
export async function comparePassword(plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword);
}

// Hash a password
export async function hashPassword(password) {
    return bcrypt.hash(password, 10); // 10 is the salt rounds
}

export default {
    generateAccessToken,
    saveRefreshToken,
    tokenExists,
    deleteRefreshToken,
    comparePassword,
    hashPassword
};