import userModel from '../models/user-model.js';
import serviceModel from '../models/service-model.js';

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
        const userId = req.user.UserID;
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

async function getClientProfile(req, res) {
    try {
        const userId = req.userId; // Extracted from token middleware
        const client = await serviceModel.getClientByUserId(userId);
        const user = await serviceModel.getUserById(userId);

        if (!client.length || !user.length) {
            return res.status(404).json({ message: 'User or Client not found' });
        }

        res.status(200).json({
            user: user[0],
            client: client[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProfile(req, res) {
    try {
        const userId = req.user.UserID;
        const { client } = req.body;
        console.log('Request Body:', req.body);

        // Ensure client data exists in the request
        if (!client) {
            return res.status(400).json({ message: 'Client data is required' });
        }

        // Ensure that password and email are not being modified
        if (client.Password || client.Email) {
            return res.status(400).json({ message: 'Password and email are not updatable' });
        }

        // Update client details
        const clientUpdateResult = await userModel.updateClient(userId, client);
        if (clientUpdateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found or no changes made' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



async function getProfile(req, res) {
    try {
        const userId = req.user.UserID; 
        console.log('Fetching profile for user ID:', userId);
        // Fetch user data using getUserById
        const user = await getUserById(userId);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch client data using getClientByUserId
        const client = await getClientByUserId(userId);
        if (!client || client.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Return both user and client data
        res.status(200).json({
            user: user[0],  // Assuming user is returned as an array and you need the first element
            client: client[0]  // Assuming client is returned as an array and you need the first element
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteAccount(req, res) {
    try {
        const userId = req.user.UserID;

        const deleteResult = await userModel.deleteClientAndUser(userId);

        if (!deleteResult) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'An error occurred while deleting the account.' });
    }
}



export {
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getClientById,
    getClientByUserId,
    getAllServicesByUserId,
    getClientProfile,
    updateProfile,
    getProfile,
    deleteAccount,
};
