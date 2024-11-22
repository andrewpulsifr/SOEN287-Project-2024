const db = require("../config/database");

// Fetch all services
function getAllServices() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Services";
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// Fetch a single service by ID
function getServiceById(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Services WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Create a new service
function createService(serviceData) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Services SET ?";
        db.query(sql, serviceData, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Update an existing service
function updateService(id, serviceData) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Services SET ? WHERE id = ?";
        db.query(sql, [serviceData, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Delete a service
function deleteService(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Services WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};


