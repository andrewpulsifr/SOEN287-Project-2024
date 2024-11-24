const userModel = require("../models/user-model");


async function getUserById(req, res) {
    try {
       // Access the user ID from the decoded token (from req.user)
       const userId = req.user.UserID;  // The UserID is stored in the decoded token
       const user = await userModel.getUserById(userId);
        if (!user.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getUserByEmail(req, res) {
    try {
        const user = await userModel.getUserByEmail(req.params.email);
        if (!user.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function updateUser(req, res) {
    try {
        const result = await userModel.updateUser(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Controller to delete a user
async function deleteUser(req, res) {
    try {
        const result = await userModel.deleteUser(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getUserById,
    getUserByEmail,

    updateUser,
    deleteUser,
};