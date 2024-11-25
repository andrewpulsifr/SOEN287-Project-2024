const connection = require('../config/database');
const pool = connection(); 


async function getClientById(clientId) {
    try {
        const [result] = await pool.query("SELECT * FROM Clients WHERE ClientID = ?", [clientId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getClientByUserId(userId) {
    try {
        const [result] = await pool.query("SELECT * FROM Clients WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getUserById(userId) {
    try {
        const [result] = await pool.query("SELECT * FROM Users WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getUserByEmail(email) {
    try {
        const [result] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function updateUser(userId, userData) {
    try {
        const [result] = await pool.query("UPDATE Users SET ? WHERE UserID = ?", [userData, userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteUser(userId) {
    try {
        const [result] = await pool.query("DELETE FROM Users WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getClientById,
    getClientByUserId
};
