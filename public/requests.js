document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("accessToken");
    console.log('JWT token:', token);

    const outstandingTable = document.getElementById("outstanding-requests");
    const pastTable = document.getElementById("past-requests");

    let outstandingServices = []; // Store fetched outstanding services
    let pastServices = []; // Store fetched past services

    async function fetchClientRequests() {
        try {
            const response = await fetch('/users/client-requests', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                ({ outstandingServices, pastServices } = data);
                populateTables(outstandingServices, pastServices);
            } else {
                console.error("Failed to fetch client requests:", await response.text());
                alert("Error fetching services. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("Failed to load services. Please try again.");
        }
    }

    function populateTables(outstandingServices, pastServices) {
        // Populate Outstanding Services Table
        outstandingServices.forEach(service => {
            const row = createServiceRow(service, true);
            outstandingTable.appendChild(row);
        });

        // Populate Past Services Table
        pastServices.forEach(service => {
            const row = createServiceRow(service, false);
            pastTable.appendChild(row);
        });
    }

    function createServiceRow(service, isOutstanding) {
        const row = document.createElement("tr");
        const actionHtml = isOutstanding
            ? `<button class="cancel-btn">Cancel</button>`
            : service.PaymentStatus === "Pending"
                ? `<button class="pay-btn">Pay</button>`
                : `<button class="view-receipt-btn">View Receipt</button>`;

        row.innerHTML = `
            <td>${service.serviceId}</td>
            <td>${service.category}</td>
            <td>${service.description}</td>
            <td>${new Date(service.AssignedDate).toLocaleDateString()}</td>
            <td>${service.DueDate ? new Date(service.DueDate).toLocaleDateString() : "N/A"}</td>
            <td>${service.price}</td>
            <td>${service.PaymentStatus}</td>
            <td>${service.Completed ? "Yes" : "No"}</td>
            <td>${actionHtml}</td>
        `;
        return row;
    }

    outstandingTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("cancel-btn")) {
            const row = event.target.closest("tr");
            const serviceId = row.cells[0].innerText;

            cancelService(serviceId).then(success => {
                if (success) {
                    row.remove();
                    alert("Service cancelled successfully.");
                }
            });
        }
    });

    pastTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("pay-btn")) {
            const row = event.target.closest("tr");
            const serviceId = row.cells[0].innerText;

            payForService(serviceId).then(success => {
                if (success) {
                    row.cells[6].innerText = "Paid";
                    row.cells[8].innerHTML = `<button class="view-receipt-btn">View Receipt</button>`;
                    alert("Payment processed successfully.");
                }
            });
        } else if (event.target.classList.contains("view-receipt-btn")) {
            const row = event.target.closest("tr");
            const serviceId = row.cells[0].innerText;
            const service = pastServices.find(s => s.serviceId === serviceId);

            if (service) openReceiptModal(service);
        }
    });

    async function cancelService(serviceId) {
        try {
            const response = await fetch(`/client-requests/${serviceId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return true;
            } else {
                console.error("Error cancelling service:", await response.text());
                alert("Failed to cancel service.");
                return false;
            }
        } catch (error) {
            console.error("Error cancelling service:", error);
            alert("An error occurred while cancelling the service.");
            return false;
        }
    }

    async function payForService(serviceId) {
        try {
            const response = await fetch(`/client-requests/${serviceId}/pay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return true;
            } else {
                console.error("Error processing payment:", await response.text());
                alert("Failed to process payment.");
                return false;
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred while processing payment.");
            return false;
        }
    }

    // Modal Functionality
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
    modal.querySelector(".close-button").onclick = () => (modal.style.display = "none");
    window.onclick = event => {
        if (event.target === modal) modal.style.display = "none";
    };

    function openReceiptModal(service) {
        receiptContent.innerHTML = `
            <strong>Order Number:</strong> ${service.serviceId}<br>
            <strong>Category:</strong> ${service.category}<br>
            <strong>Description:</strong> ${service.description}<br>
            <strong>Date of Request:</strong> ${new Date(service.AssignedDate).toLocaleDateString()}<br>
            <strong>Date Fulfilled:</strong> ${service.DateFulfilled ? new Date(service.DateFulfilled).toLocaleDateString() : "N/A"}<br>
            <strong>Price:</strong> ${service.price}<br>
            <strong>Payment Status:</strong> ${service.PaymentStatus}
        `;
        modal.style.display = "block";
    }

    // Initialize Client Requests
    fetchClientRequests();
});
