import createConnection from '../config/database.js';
const pool = createConnection(); 


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

async function updateClient(userId, client) {
    const query = `
        UPDATE Clients
        SET FirstName = ?, LastName = ?, Address = ?
        WHERE UserID = ?
    `;
    const params = [client.firstName, client.lastName, client.address, userId];
    return await pool.query(query, params);
}


async function deleteUser(userId) {
    try {
        const [result] = await pool.query("DELETE FROM Users WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getAllServicesByClientId(clientId) {
    try {
        // Query to get all services that the client has requested (using ClientID)
        const [services] = await pool.query(
            `SELECT 
            cs.ClientServiceID, 
            s.Title, 
            s.Category, 
            s.Description, 
            s.Price, 
            s.CreatedAt, 
            cs.Status, 
            cs.AssignedDate, 
            cs.DueDate, 
            cs.DateFulfilled, 
            cs.PaymentStatus, 
            cs.Completed 
        FROM Services s
        JOIN ClientServices cs ON cs.ServiceID = s.ServiceID
        WHERE cs.ClientID = ?`, 
        [clientId]
    );
        return services;  // Return the full service objects
    } catch (err) {
        console.error("Error fetching services by client ID:", err);
        throw err;  // Propagate the error to be handled by the controller
    }
}

async function getProfileByUserId(userId) {
    try {
        // Fetch user data
        const [user] = await pool.query("SELECT * FROM Users WHERE UserID = ?", [userId]);
        if (!user.length) {
            throw new Error('User not found');
        }

        // Fetch client data associated with the user
        const [client] = await pool.query("SELECT * FROM Clients WHERE UserID = ?", [userId]);
        if (!client.length) {
            throw new Error('Client not found');
        }

        // Log the client and user data
        console.log('User:', user[0]);
        console.log('Client:', client[0]);

        // Return both user and client data in a unified structure for easy updating
        return {
            user: {
                UserID: user[0].UserID,
                Email: user[0].Email,
                Password: user[0].Password,
                Role: user[0].Role,
                CreatedAt: user[0].CreatedAt
            },
            client: {
                ClientID: client[0].ClientID,
                UserID: client[0].UserID,
                FirstName: client[0].FirstName,
                LastName: client[0].LastName,
                Address: client[0].Address,
            }
        };
    } catch (err) {
        console.error("Error fetching profile:", err);
        throw err;
    }
}


async function deleteClientAndUser(userId) {
    try {
        // Transaction to ensure atomicity
        await pool.query('START TRANSACTION');

        // Delete the client record associated with the user
        const clientDeleteResult = await pool.query(
            'DELETE FROM Clients WHERE UserID = ?',
            [userId]
        );

        // Delete the user record
        const userDeleteResult = await pool.query(
            'DELETE FROM Users WHERE UserID = ?',
            [userId]
        );

        await pool.query('COMMIT');

        // Return true if at least one row was deleted for the user
        return userDeleteResult[0].affectedRows > 0;
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
}







export default {
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getClientById,
    getClientByUserId,
    getAllServicesByClientId,
    updateClient,
    getProfileByUserId,
    deleteClientAndUser,
};
