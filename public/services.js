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
                : `<a><button class="request-button">Request</button></a>`}
        `;

        card.querySelector('.details-button').onclick = () => {
            document.getElementById('modal-description').innerText = service.description;
            document.getElementById('myModal').style.display = 'block'; // disp modal
        };

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    createModal();
    const cardsGrid = document.querySelector('.cards-grid');
    const isEditPage = window.location.pathname.includes('services-business');
    createServiceCards(outstandingServices, cardsGrid, isEditPage);
});
