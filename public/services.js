import apiClient from './../api/apiClient'; // Import the axios client

/************************************************************************************************
 * Initialization of page
 * ************************************************************************************************/
// Run service page features when both auth and init are complete
function loadServicePageFeatures() {
    createModal();
    const cardsGrid = document.querySelector('.cards-grid');
    const isBusinessPage = window.location.pathname.includes('services-business');
    if (isBusinessPage) {
        fetchServices('business')
            .then(services => {
                createServiceCards(services, cardsGrid, true); // Pass services from backend, true for edit page
            })
            .catch(err => console.error("Failed to load services:", err));
        } else if (window.location.pathname.includes('services-client')) {
            // Fetch and display services for the client page
            fetchServices('client')
                .then(services => {
                    createServiceCards(services, cardsGrid, false); // Pass services from backend, false for client page
                })
                .catch(err => console.error("Failed to load services:", err));
        }
}

// Wait for both auth and init events
let authReady = false;
let initReady = false;
let loaded = false;

document.addEventListener('authInitialized', () => {
    authReady = true;
    if (authReady && initReady && !loaded) {
        loadServicePageFeatures();
        loaded = true;
    }
});

document.addEventListener('initComplete', () => {
    initReady = true;
    if (authReady && initReady  && !loaded) {
        loadServicePageFeatures();
        loaded = true;
    }
});



/************************************************************************************************
 * Modal functionality
 * ************************************************************************************************/
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.classList.add('modal');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Service Details</h2>
            <p id="modal-description"></p>
        </div>
    `;

    document.body.appendChild(modal);

    // close modal
    modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

/************************************************************************************************
 * Fetch Services from Backend
 ************************************************************************************************/
async function fetchServices() {
    try {
        const response = await apiClient.get('/services'); // Use the apiClient to make the request
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

/************************************************************************************************
 * Service management
 * ************************************************************************************************/
function createServiceCards(services, container, isEditPage = false) {
    services.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="image-placeholder"></div>
            <h3>${service.category}</h3>
            <p>${service.price}</p>
            <button class="details-button">View Details</button>
            ${isEditPage 
                ? `<a href="create-service.html"><button class="edit-button">Edit</button></a>` 
                : `<a><button class="request-button" data-service-id="${service.ServiceID}">Request</button></a>`}
        `;

        card.querySelector('.details-button').onclick = () => {
            document.getElementById('modal-description').innerText = service.Description;
            document.getElementById('myModal').style.display = 'block'; // disp modal
        };

        // event listener for the request
        const requestButton = card.querySelector('.request-button');
        if (requestButton) {
            requestButton.onclick = async () => {
                const serviceId = requestButton.getAttribute('data-service-id');
                const token = localStorage.getItem('authToken');  // Get token from local storage

                try {
                    const response = await fetch('/services/request', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ serviceId })  // Send service ID in the request body
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert('Service requested successfully!');
                    } else {
                        alert('Error requesting service: ' + result.error);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error requesting service');
                }
            };
        }

        container.appendChild(card);
    });
}