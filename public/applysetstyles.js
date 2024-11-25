document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/get-config');
        const config = await response.json();

        if (config) {
            document.documentElement.style.setProperty('--primary-color', `${config.primary_color} !important`);
            document.documentElement.style.setProperty('--secondary-color', `${config.secondary_color} !important`);
            document.documentElement.style.setProperty('--accent-color', `${config.accent_color} !important`);
            
            const companyNameElement = document.querySelector('.companyname a');
            if (companyNameElement) {
                companyNameElement.textContent = config.business_name;
            }

            // Update about section
            const clientaboutSectionElement = document.querySelector('.client-about');
            if (clientaboutSectionElement) {
                clientaboutSectionElement.innerHTML = `
                    <h2>About Us</h2>
                    <p>${config.about_section}</p>
                `;
            }

            const businessaboutSectionElement = document.querySelector('.business-about');
            if (businessaboutSectionElement) {
                businessaboutSectionElement.innerHTML = `
                    <h2>About Us</h2>
                    <p>${config.about_section}</p>
                `;
            }

            // Update preview areas or other UI elements if necessary
        }
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
});
