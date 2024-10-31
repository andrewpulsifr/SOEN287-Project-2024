document.addEventListener('DOMContentLoaded', () => {
    const service_form = document.querySelector('.form');
    const image = document.getElementById('image');
    
    service_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            orderNumber: `SR-${Date.now()}`,
            category: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: `$${document.getElementById('price').value}`,
            image: await getBase64(image.files[0]),
            dateOfRequest: new Date().toLocaleDateString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
            paymentStatus: "unpaid",
            completed: false
        };
        
        console.log(formData)
        const services = JSON.parse(localStorage.getItem('services') || '[]');
        services.push(formData);
        localStorage.setItem('services', JSON.stringify(services));

        window.location.href = './services-business.html';
    });
});


document.addEventListener("DOMContentLoaded", function() {
    createModal();
    const cardsGrid = document.querySelector('.cards-grid');
    const searchInput = document.querySelector('.search-bar input');
    const isEditPage = window.location.pathname.includes('services-business');


    const storedServices = JSON.parse(localStorage.getItem('services') || '[]');
    const allServices = [...outstandingServices, ...storedServices];

    function displayServices(services) {
        cardsGrid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                ${service.image ? 
                    `<div class="image-placeholder"><img src="${service.image}" alt="${service.category}"></div>` :
                    `<div class="image-placeholder"></div>`
                }
                <h3>${service.category}</h3>
                <p>${service.price}</p>
                <button class="details-button">View Details</button>
                ${isEditPage 
                    ? `<button class="edit-button">Edit</button>
                       <button class="delete-button">Delete</button>` 
                    : `<button class="request-button">Request</button>`
                    
                }
                <button class="confirm-button">Confirm</button>
            `;

            card.querySelector('.details-button').onclick = () => {
                document.getElementById('modal-description').innerText = service.description;
                document.getElementById('myModal').style.display = 'block';
            };

            if (isEditPage) {
                card.querySelector('.delete-button').onclick = () => {
                    const services = JSON.parse(localStorage.getItem('services') || '[]');
                    const updatedServices = services.filter(s => s.orderNumber !== service.orderNumber);
                    localStorage.setItem('services', JSON.stringify(updatedServices));
                    displayServices([...outstandingServices, ...updatedServices]);
                };

                card.querySelector('.edit-button').onclick = () => {
                    localStorage.setItem('serviceToEdit', JSON.stringify(service));
                    window.location.href = 'create-service.html';
                };
            }

            cardsGrid.appendChild(card);
        });
    }

    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredServices = allServices.filter(service => 
            service.category.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );
        displayServices(filteredServices);
    });

    
    displayServices(allServices);
});