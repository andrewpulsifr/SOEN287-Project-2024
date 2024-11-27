import serviceModel from "../models/service-model.js";
import clientModel from "../models/user-model.js"; 

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

// Create a new service
async function createService(req, res) {
    try {
        const newService = req.body;
        const result = await serviceModel.createService(newService);
        res.status(201).json({ message: "Service created", serviceId: result.insertId });
    } catch (err) {
        console.error("Error creating service:", err);
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

// Cancel a requested service
async function cancelService(req, res) {
    console.log("Cancelling requested service...");
    try {
        // Extract the `ClientServiceID` from the request parameters
        const clientServiceId = req.params.clientServiceId || req.params.serviceId;
        if (!clientServiceId) {
            return res.status(400).json({ error: "ClientServiceID is required" });
        }
        // Check if the requested service exists in `ClientServices`
        /*const clientService = await serviceModel.getClientServiceById(clientServiceId);
        if (!clientService || clientService.length === 0) {
            return res.status(404).json({ error: "Requested service not found" });
        }*/

        // Delete the record from `ClientServices`
        await serviceModel.cancelServiceRequest(clientServiceId);

        res.json({ message: "Requested service cancelled successfully" });
    } catch (err) {
        console.error("Error cancelling requested service:", err);
        res.status(500).json({ error: "Error cancelling requested service", details: err });
    }
}

async function getClientProfile(req, res) {
    try {
        const userId = req.userId; // Extracted from token middleware
        const client = await userModel.getClientByUserId(userId);
        const user = await userModel.getUserById(userId);

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

async function updateClientProfile(req, res) {
    try {
        const userId = req.userId; // Extracted from token middleware
        const { user, client } = req.body;

        // Update user details
        const userUpdateResult = await userModel.updateUser(userId, user);
        if (userUpdateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
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




export {
    fetchAllServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    requestService,
    cancelService,
    getClientProfile,
    updateClientProfile,
};
