const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createConnection = require('../../api/config/database');
const dbConnection = createConnection();

const router = express.Router();

// Generate access tokens
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Store a refresh token in the database
async function saveRefreshToken(userId, token) {
    const sql = 'INSERT INTO RefreshTokens (UserID, Token) VALUES (?, ?)';
    await dbConnection.query(sql, [userId, token]);
}

// Verify if a refresh token exists in the database
async function tokenExists(token) {
    const sql = 'SELECT Token FROM RefreshTokens WHERE Token = ?';
    const [results] = await dbConnection.query(sql, [token]);
    return results.length > 0;
}

// Remove a refresh token from the database
async function deleteRefreshToken(token) {
    const sql = 'DELETE FROM RefreshTokens WHERE Token = ?';
    await dbConnection.query(sql, [token]);
}

// POST /login: Handles user login
router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
        return res.status(400).json({ message: 'Missing email, password, or userType.' });
    }

    try {
        const [users] = await dbConnection.query('SELECT * FROM Users WHERE Email = ?', [email]);
        const user = users[0];

        if (!user || user.Role !== userType) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ UserID: user.UserID, role: user.Role });
        const refreshToken = jwt.sign({ UserID: user.UserID, role: user.Role }, process.env.REFRESH_TOKEN_SECRET);

        // Save refresh token in database
        await saveRefreshToken(user.UserID, refreshToken);

        res.json({
            message: 'Login successful.',
            accessToken,
            refreshToken,
            role: user.Role
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// POST /token: Generate a new access token using a valid refresh token
router.post('/token', async (req, res) => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    try {
        const exists = await tokenExists(refreshToken);
        if (!exists) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);

            const accessToken = generateAccessToken({ UserID: user.UserID, role: user.role });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// DELETE /logout: Remove a refresh token from the database
router.delete('/logout', async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: 'No token provided.' });

    try {
        await deleteRefreshToken(token);
        res.sendStatus(204); // Successful logout
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/register', async (req, res) => {
  const { email, password, address, 'first-name': firstName, 'last-name': lastName } = req.body;

  // Validate input fields
  if (!email || !password || !address || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
      // Check if the email is already registered
      const [existingUsers] = await dbConnection.query('SELECT * FROM Users WHERE Email = ?', [email]);
      if (existingUsers.length > 0) {
          return res.status(400).json({ message: 'Email is already registered.' });
      }

      // Hash the plaintext password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for hashing strength

      // Insert the new user into the `Users` table
      const [userResult] = await dbConnection.query(
          'INSERT INTO Users (Email, Password, Role) VALUES (?, ?, ?)',
          [email, hashedPassword, 'Client'] // Default role set to 'Client'
      );

      // Insert additional client information into the `Clients` table
      await dbConnection.query(
          'INSERT INTO Clients (UserID, FirstName, LastName, Address) VALUES (?, ?, ?, ?)',
          [userResult.insertId, firstName, lastName, address] // `insertId` contains the UserID of the newly created user
      );

      res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error.'+error });
  }
});

module.exports = router;
