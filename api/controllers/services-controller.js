const serviceModel = require("../models/service-model");

// Get all services
async function fetchAllServices(req, res) {
    try {
        const services = await serviceModel.getAllServices();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Error fetching services", details: err });
    }
}

// Get a specific service
async function fetchServiceById(req, res) {
    try {
        const service = await serviceModel.getServiceById(req.params.id);
        if (service.length === 0) return res.status(404).json({ error: "Service not found" });
        res.json(service[0]);
    } catch (err) {
        res.status(500).json({ error: "Error fetching service", details: err });
    }
}

// Create a new service
async function createService(req, res) {
    try {
        const newService = req.body;
        const result = await serviceModel.createService(newService);
        res.status(201).json({ message: "Service created", serviceId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Error creating service", details: err });
    }
}

// Update an existing service
async function updateService(req, res) {
    try {
        const serviceData = req.body;
        await serviceModel.updateService(req.params.id, serviceData);
        res.json({ message: "Service updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error updating service", details: err });
    }
}

// Delete a service
async function deleteService(req, res) {
    try {
        await serviceModel.deleteService(req.params.id);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting service", details: err });
    }
}

module.exports = {
    fetchAllServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
};
