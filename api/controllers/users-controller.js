const userModel = require("../models/user-model");
const serviceModel = require("../models/service-model");
const jwt = require('jsonwebtoken');

async function getClientById(req, res) {
    try {
        const clientId = req.params.id; 
        const client = await userModel.getClientById(clientId);
        if (!client.length) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getClientByUserId(req, res) {
    try {
        const userId = req.user.UserID;  
        const client = await userModel.getClientByUserId(userId);
        if (!client.length) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getUserById(req, res) {
    try {
        const userId = req.user.UserID; 
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

async function getAllServicesByUserId(req, res) {
    try {
        console.log("Fetching services for UserID:", req.user.UserID);

        // Get ClientID using UserID
        const client = await userModel.getClientByUserId(req.user.UserID);
        console.log("Client fetched:", client);

        if (!client || client.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }

        const clientId = client[0].ClientID;
        console.log("Using ClientID:", clientId);

        // Fetch services using ClientID
        const services = await userModel.getAllServicesByClientId(clientId);
        console.log("Services fetched:", services);

        if (!services || services.length === 0) {
            return res.status(404).json({ error: "No services found for this client" });
        }

        res.status(200).json(services);
    } catch (err) {
        console.error("Error fetching services by User ID:", err);
        res.status(500).json({ error: "Error fetching services", details: err });
    }
}


module.exports = {
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getClientById,
    getClientByUserId,
    getAllServicesByUserId,
};
