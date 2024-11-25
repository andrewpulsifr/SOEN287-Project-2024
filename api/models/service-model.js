const db = require("../config/database"); 
const pool = db(); 

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
    try {
        const [result] = await pool.query("INSERT INTO Services SET ?", [serviceData]);  
        return result;
    } catch (err) {
        throw err;
    }
}

// Update an existing service
async function updateService(id, serviceData) {
    try {
        const [result] = await pool.query("UPDATE Services SET ? WHERE id = ?", [serviceData, id]);  
        return result;
    } catch (err) {
        throw err;
    }
}

// Delete a service
async function deleteService(id) {
    try {
        const [result] = await pool.query("DELETE FROM Services WHERE id = ?", [id]);  
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

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    requestService, 
};
