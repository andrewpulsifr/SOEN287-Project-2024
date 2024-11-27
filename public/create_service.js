document.addEventListener('DOMContentLoaded', () => {
    const service_form = document.querySelector('.form');
    const image = document.getElementById('image');
    const token = localStorage.getItem('token');
    
    service_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            category: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value,
            image: await getBase64(image.files[0])
        };
        
        try {
            const response = await fetch('/services/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.location.href = './services-business.html';
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Failed to create service');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again.');
        }
    });
});

// Existing getBase64 function (make sure this is defined)
async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}