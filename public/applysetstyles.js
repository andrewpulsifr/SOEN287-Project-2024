document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/get-config');
        const config = await response.json();

        if (config) {
            document.documentElement.style.setProperty('--primary-color', config.primary_color);
            document.documentElement.style.setProperty('--secondary-color', config.secondary_color);
            document.documentElement.style.setProperty('--accent-color', config.accent_color);
            const companyNameElement = document.querySelector('.companyname a');
            if (companyNameElement) {
                companyNameElement.textContent = config.business_name;
            }

            // Update about section
            const aboutSectionElement = document.querySelector('.client-about');
            if (aboutSectionElement) {
                aboutSectionElement.innerHTML = `
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
