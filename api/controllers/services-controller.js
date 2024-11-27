const serviceModel = require("../models/service-model");
const clientModel = require("../models/user-model"); // Assuming you have a model for client data
const jwt = require('jsonwebtoken');

// Get all services
async function fetchAllServices(req, res) {
    try {
        console.log("Fetching all services...");
        const services = await serviceModel.getAllServices();
        console.log("Services fetched:", services);
        res.json(services);
    } catch (err) {
        console.error("Error fetching services:", err);
        res.status(500).json({ error: "Error fetching services", details: err });
    }
}
async function createService(req, res) {
    const { category, description, price, image } = req.body;

    const db = createConnection();
    const query = `
        INSERT INTO Services (Title, Category, Description, Price, Image) 
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        console.log('Received data:', { category, description, price, image });

        const [result] = await db.execute(query, [
            category, 
            category, 
            description, 
            parseFloat(price), 
            image || null
        ]);

        res.status(201).json({ 
            message: 'Service created successfully', 
            serviceId: result.insertId 
        });
    } catch (error) {
        console.error('Detailed Database error:', error.sqlMessage || error);
        res.status(500).json({ 
            error: 'Failed to create service', 
            details: error.sqlMessage || error.toString() 
        });
    } finally {
        db.end();
    }
}

// Get a specific service
async function fetchServiceById(req, res) {
    try {
        const service = await serviceModel.getServiceById(req.params.id);
        if (service.length === 0) return res.status(404).json({ error: "Service not found" });
        res.json(service[0]);
    } catch (err) {
        console.error("Error fetching service:", err);
        res.status(500).json({ error: "Error fetching service", details: err });
    }
}



// Update an existing service
async function updateService(req, res) {
    try {
        const serviceData = req.body;
        await serviceModel.updateService(req.params.id, serviceData);
        res.json({ message: "Service updated successfully" });
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ error: "Error updating service", details: err });
    }
}

// Delete a service
async function deleteService(req, res) {
    try {
        await serviceModel.deleteService(req.params.id);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        console.error("Error deleting service:", err);
        res.status(500).json({ error: "Error deleting service", details: err });
    }
}

// request a Service
async function requestService(req, res) {
    console.log("Requesting service...");
    try {
        // Use req.user from the middleware where the token is already decoded
        const userId = req.user.UserID;  // Get the userId from the decoded token stored in req.user
        const serviceId = req.body.serviceId; // Service ID should be passed in the request body

        // Check if the service exists
        const service = await serviceModel.getServiceById(serviceId);
        if (!service || service.length === 0) {
            return res.status(404).json({ error: "Service not found" });
        }

        // Check if the client exists using the userId (from the decoded token)
        const client = await clientModel.getClientByUserId(userId);
        if (!client || client.length === 0) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Insert a new record into the ClientServices table
        const result = await serviceModel.requestService(client[0].ClientID, serviceId);  // Use the ClientID from the client record

        res.status(201).json({ message: "Service requested successfully", clientServiceId: result.insertId });

    } catch (err) {
        console.error("Error requesting service:", err);
        res.status(500).json({ error: "Error requesting service", details: err });
    }
}



module.exports = {
    fetchAllServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    requestService,
};
