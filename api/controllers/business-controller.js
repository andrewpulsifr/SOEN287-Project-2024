import business_model from "../models/business-model.js"
import serviceModel from "../models/service-model.js";
export const submitBusinessConfig = async (req, res) => {
    try {
        const { business_name, about_section, primary_color, secondary_color, accent_color } = req.body;

        if (!business_name || !about_section || !primary_color || !secondary_color || !accent_color) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await business_model.submitBusinessConfig({ business_name, about_section, primary_color, secondary_color, accent_color });

        res.status(200).json({ message: 'Business configuration saved successfully' });
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
};
export const fetchAllClientServices =  async (req, res) => {
    try{
        const services = await serviceModel.getAllClientServices();
        res.json(services);
    }catch(err){
        console.error("Error fetching client services", err);
        res.status(500).json({error: 'Error fetching client services'});
    }
}

export const markServiceAsComplete=  async (req, res) => {
    const { clientServiceId } = req.body;

    if (!clientServiceId) {
        return res.status(400).json({ error: 'ClientServiceID is required' });
    }

    try {
        const result = await serviceModel.updateServiceStatusToComplete(clientServiceId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Service not found or already completed' });
        }

        res.status(200).json({ message: 'Service marked as complete' });
    } catch (error) {
        console.error('Error marking service as complete:', error);
        res.status(500).json({ error: 'Failed to mark service as complete' });
    }
}
