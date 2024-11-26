import { fetchWrapper } from './fetchHandler/fetchWrapper.js';

/************************************************************************************************
 * Initialization of page
 * ************************************************************************************************/
// Run service page features when both auth and init are complete
const token = localStorage.getItem("accessToken");
    console.log('jwt toke, token:', token);

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
    console.log('in authInitit Auth Initialized, token:', token);
    authReady = true;
    if (authReady && initReady && !loaded) {
        console.log('authReady', authReady);
        loadServicePageFeatures();
        loaded=true;
    }
});

document.addEventListener('initComplete', () => {
    initReady = true;
    if (authReady && initReady  && !loaded) {
        console.log('initReady', initReady);
        loadServicePageFeatures();
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
        // Validate access token with a protected API route
        const url = '/services'; // The endpoint you want to call
        const options = {
            method: 'GET', // HTTP method for the request
        };
    
        const response = await fetchWrapper(url,options, token);

        if (response.ok) {  // Check if the response was successful
            return await response.json();  // Convert response to JSON
        } else {
            throw new Error('Failed to fetch services',+ response.message);
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

/************************************************************************************************
 * Service management
 * ************************************************************************************************/
function createServiceCards(services, container, isEditPage = false) {
    console.log("Creating cards for services:", services); // Log to check service data
    services.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="image-placeholder"></div>
            <h3>${service.Category}</h3>
            <p>${service.Price}</p>
            <button class="details-button">View Details</button>
            ${isEditPage 
                ? `<a href="create-service.html"><button class="edit-button">Edit</button></a>` 
                : `<a><button class="request-button" data-service-id="${service.ServiceID}">Request</button></a>`}
        `;

        card.querySelector('.details-button').onclick = () => {
            document.getElementById('modal-description').innerText = service.Description;
            document.getElementById('myModal').style.display = 'block'; // disp modal
        }; 
    // Request service functionality
    if (!isEditPage) {
        const requestButton = card.querySelector('.request-button');
        requestButton.onclick = () => requestService(service.ServiceID);
    }

    container.appendChild(card);
    });
    }

/************************************************************************************************
* Request Service
************************************************************************************************/
async function requestService(serviceId) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert('Authentication token is missing.');
        return;
    }

    try {
        const url = '/services/request';  // The endpoint for the request
        const options = {
            method: 'POST', // HTTP method for the request
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serviceId }) // Body with serviceId
        };

        const response = await fetchWrapper(url, options, token);  // Using fetchWrapper

        if (response.ok) {
            alert('Service requested successfully!');
        } else {
            // Try to parse the response to check for any error messages
            let responseData = {};
            try {
                responseData = await response.json();
            } catch (jsonError) {
                console.error('Error parsing response JSON:', jsonError);
                responseData = { error: 'Invalid response format from the server' };
            }

            const errorMessage = responseData.error || 'Unknown error';
            alert(`Error requesting service: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error requesting service:', error);
        alert('An error occurred while requesting the service.');
    }
}




window.onload = async function() {
    const services = await fetchServices();
    console.log("Services: " + services)
    
    if (services.length > 0) {
        const container = document.querySelector('.cards-grid');
        createServiceCards(services, container);
    } else {
        console.log('No services available or error fetching services');
    }
};
