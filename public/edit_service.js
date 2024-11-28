document.addEventListener('DOMContentLoaded', async () => {
    console.log("loaded")
    const service_form = document.querySelector('.form');
    const imageInput = document.getElementById('image');
    const accessToken = localStorage.getItem('accessToken');
    const serviceId = new URLSearchParams(window.location.search).get('id'); // Get ID from URL

    if (!serviceId) {
        alert('No service ID provided');
        window.location.href = './services-business.html'; // Redirect if no ID is present
        return;
    }

    // Fetch and pre-fill service details
    try {
        const response = await fetch(`/services/${serviceId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch service details');
        }

        const service = await response.json();
        console.log('Fetched service details:', service);

        // Pre-fill form with existing data
        document.getElementById('title').value = service.Title;
        document.getElementById('description').value = service.Description;
        document.getElementById('price').value = service.Price;
        // Optionally, display the existing image as a preview
    } catch (err) {
        console.error('Error fetching service:', err);
        alert('Error loading service details. Redirecting...');
        window.location.href = './services-business.html'; // Redirect on error
    }

    // Handle form submission for updating the service
    service_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const imageFile = imageInput.files[0];
        const updatedData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('title').value, // Modify as needed
            price: document.getElementById('price').value,
            image: imageFile ? await getBase64(imageFile) : null, // Convert image if provided
        };

        console.log('Updated Data:', updatedData);

        try {
            const response = await fetch(`/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('Service updated successfully!');
                window.location.href = './services-business.html'; // Redirect after update
            } else {
                const errorData = await response.json();
                console.error('Error updating service:', errorData);
                alert('Failed to update service');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        }
    });
});

// Function to convert file to Base64
async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
