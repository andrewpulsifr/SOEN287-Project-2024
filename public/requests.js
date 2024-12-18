import { fetchWrapper } from './fetchHandler/fetchWrapper.js';

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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched Data:', data);  // Check the structure of the response
    
                // Ensure the response data has the expected structure
                if (Array.isArray(data)) {
                    filterAndPopulateTables(data); // Filter data and populate tables
                } else {
                    console.error("Invalid response data structure:", data);
                    alert("Error: Unexpected data structure received. Please try again.");
                }
            } else {
                console.error("Failed to fetch client requests:", await response.text());
                alert("Error fetching services. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("Failed to load services. Please try again.");
        }
    }
    
    function filterAndPopulateTables(services) {
        // Filter the services based on the 'Completed' status
        const outstandingServices = services.filter(service => !service.Completed);
        const pastServices = services.filter(service => service.Completed);
    
        // Clear existing rows in both tables
        outstandingTable.innerHTML = '';
        pastTable.innerHTML = '';
    
        // Populate Outstanding Services Table
        outstandingServices.forEach(service => {
            const row = createServiceRow(service, true);  // Use `true` for outstanding services
            outstandingTable.appendChild(row);
        });
    
        // Populate Past Services Table
        pastServices.forEach(service => {
            const row = createServiceRow(service, false);  // Use `false` for completed services
            pastTable.appendChild(row);
        });
    }

    function createServiceRow(service, isOutstanding) {
        const row = document.createElement("tr");

        // Default values for missing fields
        const assignedDate = service.AssignedDate ? new Date(service.AssignedDate).toLocaleDateString() : "N/A";
        const dueDate = service.DueDate ? new Date(service.DueDate).toLocaleDateString() : "N/A";
        const price = service.Price || "N/A";
        const paymentStatus = service.PaymentStatus || "N/A";
        const completed = service.Completed ? "Yes" : "No";
        const actionHtml = isOutstanding
            ? `<button class="cancel-btn">Cancel</button>`
            : service.PaymentStatus === "Pending"
                ? `<button class="pay-btn">Pay</button>`
                : `<button class="view-receipt-btn">View Receipt</button>`;

        row.innerHTML = `
            <td>${service.ClientServiceID || "N/A"}</td>
            <td>${service.Category || "N/A"}</td>
            <td>${service.Description || "N/A"}</td>
            <td>${assignedDate}</td>
            <td>${dueDate}</td>
            <td>${price}</td>
            <td>${paymentStatus}</td>
            <td>${completed}</td>
            <td>${actionHtml}</td>
        `;
        return row;
    }

    outstandingTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("cancel-btn")) {
            const row = event.target.closest("tr");
            const clientServiceId = row.cells[0].innerText;

            cancelService(clientServiceId).then(success => {
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
            const clientServiceId = row.cells[0].innerText;

            alert("Payment processed successfully.");

            row.cells[6].innerText = "Paid"; // Update payment status column
            row.cells[8].innerHTML = `<button class="view-receipt-btn">Paid</button>`; // Replace pay with receipt button
        } 
        if (event.target.classList.contains("view-receipt-btn")) {
            const row = event.target.closest("tr");
            const clientServiceId = row.cells[0].innerText;
            const service = pastServices.find(s => s.ClientServiceID === clientServiceId);
    
            if (service) {
                openReceiptModal(service);} // Opens the receipt modal
        }
    });
    
    

    async function cancelService(clientServiceId) {
        try {

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass JWT token
                },
                body: JSON.stringify({ clientServiceId: clientServiceId }) // Pass the ClientServiceID in the body
            };
    
            // Use the fetchWrapper to handle the request
            const response = await fetchWrapper(`/services/request/${clientServiceId}/cancel`, options, token);
    
            if (response.ok) {
                alert("Service cancelled successfully.");
                // After cancellation, re-fetch and update the tables
                //fetchClientRequests();
                return true; // Successfully canceled the service
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
    
    


    function createModal() {
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
        
        // Append the modal to the body
        document.body.appendChild(modal);
    
        // Get the receipt content and close button elements
        const receiptContent = document.getElementById("receipt-content");
        const closeButton = modal.querySelector(".close-button");
    
        // Close button functionality
        closeButton.onclick = () => {
            modal.style.display = "none";
        };
    
        // Close the modal if the user clicks outside of it
        window.onclick = event => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
        
        return modal;
    }
    

    const modal = createModal();
    
    // Function to open the receipt modal with details
    function openReceiptModal(service) {
        const receiptContent = document.getElementById("receipt-content");
        receiptContent.innerHTML = `
            <strong>Order Number:</strong> ${service.ClientServiceID}<br>
            <strong>Category:</strong> ${service.Category}<br>
            <strong>Description:</strong> ${service.Description}<br>
            <strong>Date of Request:</strong> ${new Date(service.AssignedDate).toLocaleDateString()}<br>
            <strong>Date Fulfilled:</strong> ${service.DateFulfilled ? new Date(service.DateFulfilled).toLocaleDateString() : "N/A"}<br>
            <strong>Price:</strong> ${service.Price}<br>
            <strong>Payment Status:</strong> ${service.PaymentStatus}
        `;
        modal.style.display = "block"; // Show the modal
    }
    


    // Initialize Client Requests
    fetchClientRequests();
});
