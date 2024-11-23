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
async function getServiceById(id) {
    try {
        const [result] = await pool.query("SELECT * FROM Services WHERE id = ?", [id]);  
        return result;
    } catch (err) {
        throw err;
    }
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

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
