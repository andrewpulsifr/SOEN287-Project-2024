document.querySelector(".form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        business_name: document.getElementById("title").value,
        about_section: document.getElementById("description").value,
        primary_color: document.getElementById("primaryColor").value,
        secondary_color: document.getElementById("secondaryColor").value,
        accent_color: document.getElementById("accentColor").value,
    };

    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('/business/submit-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
             },
            
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});
