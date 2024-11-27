import business_model from "../models/business-model.js"
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