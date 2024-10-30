document.addEventListener("DOMContentLoaded", function() {
    const outstandingServices = [
        {
            orderNumber: "SR-20241010-001",
            category: "Plumbing",
            description: "Leaky faucet repair",
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

    const pastServices = [
        {
            orderNumber: "SH-20231210-001",
            category: "HVAC",
            description: "Air conditioner maintenance",
            dateOfRequest: "12/10/2023",
            dateFulfilled: "12/15/2023",
            price: "$150",
            paymentStatus: "unpaid",
            completed: true
        },
        {
            orderNumber: "SH-20231105-002",
            category: "Roofing",
            description: "Shingle replacement",
            dateOfRequest: "11/05/2023",
            dateFulfilled: "11/10/2023",
            price: "$200",
            paymentStatus: "paid",
            completed: true
        }
    ];

    const outstandingTable = document.getElementById("outstanding-requests");
    const pastTable = document.getElementById("past-requests");

    outstandingServices.forEach(service => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${service.orderNumber}</td>
            <td>${service.category}</td>
            <td>${service.description}</td>
            <td>${service.dateOfRequest}</td>
            <td>${service.dueDate}</td>
            <td>${service.price}</td>
            <td>${service.paymentStatus}</td>
            <td>${service.completed}</td>
            <td><button class="cancel-btn">Cancel</button></td>
        `;

        outstandingTable.appendChild(row);
    });

    pastServices.forEach(service => {
        const row = document.createElement("tr");

        let actionsHtml;
        if (service.paymentStatus === "unpaid") {
            actionsHtml = `<button class="pay-btn">Pay</button>`;
        } else {
            actionsHtml = `<button class="view-receipt-btn">View Receipt</button>`;
        }

        row.innerHTML = `
            <td>${service.orderNumber}</td>
            <td>${service.category}</td>
            <td>${service.description}</td>
            <td>${service.dateOfRequest}</td>
            <td>${service.dateFulfilled}</td>
            <td>${service.price}</td>
            <td>${service.paymentStatus}</td>
            <td>${service.completed}</td>
            <td>${actionsHtml}</td>
        `;

        pastTable.appendChild(row);
    });

    outstandingTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("cancel-btn")) {
            const row = event.target.closest("tr");
            row.remove();
            alert("Service cancelled.");
        }
    });

    pastTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("pay-btn")) {
            const row = event.target.closest("tr");
            const service = pastServices.find(s => s.orderNumber === row.cells[0].innerText);

            if (service) {
                service.paymentStatus = "paid";
                row.cells[6].innerText = "paid";
                row.cells[8].innerHTML = `<button class="view-receipt-btn">View Receipt</button>`;
                
                alert("Payment processed.");
            }
        }
    });

// Modal
const modal = document.createElement("div");
modal.id = "receipt-modal";
modal.className = "modal";
modal.style.display = "none";
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Receipt Details</h2>
        <p id="receipt-content"></p>
    </div>
`;
document.body.appendChild(modal);

const receiptContent = document.getElementById("receipt-content");

// Open modal
function openReceiptModal(service) {
    receiptContent.innerHTML = `
        <strong>Order Number:</strong> ${service.orderNumber}<br>
        <strong>Category:</strong> ${service.category}<br>
        <strong>Description:</strong> ${service.description}<br>
        <strong>Date of Request:</strong> ${service.dateOfRequest}<br>
        <strong>Date Fulfilled:</strong> ${service.dateFulfilled || "Pending"}<br>
        <strong>Price:</strong> ${service.price}<br>
        <strong>Payment Status:</strong> ${service.paymentStatus}
    `;
    modal.style.display = "block";
}

// Close modal
modal.querySelector(".close-button").onclick = () => { modal.style.display = "none"; };
window.onclick = (event) => { if (event.target === modal) { modal.style.display = "none"; } };

// Display modal
document.getElementById("past-requests").addEventListener("click", function(event) {
    if (event.target.classList.contains("view-receipt-btn")) {
        const row = event.target.closest("tr");
        const orderNumber = row.cells[0].innerText;
        const service = pastServices.find(s => s.orderNumber === orderNumber);

        if (service) {
            openReceiptModal(service);
        }
    }
});
    
});
