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
            progress: "In Progress"
        },
        {
            orderNumber: "SR-20240911-002",
            category: "Drywall",
            description: "Wall crack fix",
            dateOfRequest: "09/11/2024",
            dueDate: "09/20/2024",
            price: "$250",
            paymentStatus: "paid",
            progress: "In Progress"
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
            paymentStatus: "paid",
            progress: "Completed"
        },
        {
            orderNumber: "SH-20231105-002",
            category: "Roofing",
            description: "Shingle replacement",
            dateOfRequest: "11/05/2023",
            dateFulfilled: "11/10/2023",
            price: "$200",
            paymentStatus: "paid",
            progress: "Completed"
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
            <td>${service.progress}</td>
            <td><button class="cancel-btn">Cancel</button></td>
        `;

        outstandingTable.appendChild(row);
    });

    pastServices.forEach(service => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${service.orderNumber}</td>
            <td>${service.category}</td>
            <td>${service.description}</td>
            <td>${service.dateOfRequest}</td>
            <td>${service.dateFulfilled}</td>
            <td>${service.price}</td>
            <td>${service.paymentStatus}</td>
            <td>${service.progress}</td>
             <td><button class="view-receipt-btn">View Receipt</button></td>
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
});
