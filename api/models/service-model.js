import createConnection from '../config/database.js';

const pool = createConnection(); 

// Fetch all services
async function getAllServices() {
    try {
        const [results] = await pool.query("SELECT * FROM Services");  
        return results;
    } catch (err) {
        throw err;
    }
}

// Fetch a single service by ID
async function getServiceById(serviceId) {
    const query = 'SELECT * FROM Services WHERE ServiceID = ?';
    const [rows] = await pool.query(query, [serviceId]);
    return rows;
}

// Create a new service
async function createService(serviceData) {
    const db = createConnection();
    try {
        const query = "INSERT INTO Services SET ?";
        const [result] = await db.query(query, serviceData);
        return result;
    } catch (err) {
        console.error('Database error in createService:', err);
        throw err;
    } finally {
        db.end();
    }
}

// Update an existing service
async function updateService(id, serviceData) {
    try {
        const [result] = await pool.query("UPDATE Services SET ? WHERE ServiceID = ?", [serviceData, id]);  
        return result;
    } catch (err) {
        throw err;
    }
}

// Delete a service
async function deleteService(id) {
    try {
        const [result] = await pool.query("DELETE FROM Services WHERE ServiceID = ?", [id]);  
        return result;
    } catch (err) {
        throw err;
    }
}

async function requestService(clientId, serviceId) {
    try {
        // Example query to insert a new record into ClientServices table
        const [result] = await pool.query(
            "INSERT INTO ClientServices (ClientID, ServiceID) VALUES (?, ?)",
            [clientId, serviceId]
        );
        return result;  // Return the result of the insert query
    } catch (err) {
        console.error("Error in requestService:", err);
        throw err;  // Propagate the error to be handled by the controller
    }
}

async function getClientServiceById(clientServiceId) {
    try {
        const query = 'SELECT * FROM ClientServices WHERE ClientServiceID = ?';
        const [rows] = await pool.query(query, [clientServiceId]);
        return rows;
    } catch (err) {
        throw err;
    }
}

// Delete a requested service by ClientServiceID
async function cancelServiceRequest(clientServiceId) {
    try {
        const query = 'DELETE FROM ClientServices WHERE ClientServiceID = ?';
        const [result] = await pool.query(query, [clientServiceId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function updateClient(userId, clientData) {
    try {
        const [result] = await pool.query('UPDATE Clients SET ? WHERE UserID = ?', [clientData, userId]);
        return result;
    } catch (err) {
        throw err;
    }
}
async function getAllClientServices() {
    const query = `
        SELECT cs.ClientServiceID, cs.Status, cs.AssignedDate, cs.DueDate, cs.PaymentStatus, 
               c.FirstName, c.LastName, s.Category, s.Description, s.Price
        FROM ClientServices cs
        INNER JOIN Clients c ON cs.ClientID = c.ClientID
        INNER JOIN Services s ON cs.ServiceID = s.ServiceID
        ORDER BY cs.AssignedDate DESC;
    `;
    const [results] = await pool.query(query);
    return results;
}

export default {
    getAllServices,
    getServiceById,
    getAllClientServices,
    createService,
    updateService,
    deleteService,
    requestService, 
    getClientServiceById,
    cancelServiceRequest,
    updateClient,
};
