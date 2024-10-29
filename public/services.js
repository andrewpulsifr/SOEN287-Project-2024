const outstandingServices = [
    {
        orderNumber: "SR-20241010-001",
        category: "Plumbing",
        description: "Leaky faucet repair ",
        dateOfRequest: "10/10/2024",
        dueDate: "10/15/2024",
        price: "$100",
        paymentStatus: "unpaid",
        completed: false
    },
    {
        orderNumber: "SR-20240911-002",
        category: "Drywall",
        description: "Wall crack fix",
        dateOfRequest: "09/11/2024",
        dueDate: "09/20/2024",
        price: "$250",
        paymentStatus: "paid",
        completed: false
    }
];

function createServiceCards(services, container, isEditPage = false) {
    services.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="image-placeholder"></div>
            <h3>${service.category}</h3>
            <p>${service.price}</p>
            <p>${service.description}</p>
            <a href="productdetail.html"><button class="details-button">View Details</button></a>
            ${isEditPage 
                ? `<a href="edit-service.html"><button class="edit-button">Edit</button></a>` 
                : `<a><button class="request-button">Request</button></a>`
            }
        `;

        container.appendChild(card);
    });
}
const cardsGrid = document.querySelector('.cards-grid');

const isEditPage = window.location.pathname.includes('services-business');

createServiceCards(outstandingServices, cardsGrid, isEditPage);
