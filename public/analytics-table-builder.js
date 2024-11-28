document.addEventListener('DOMContentLoaded', () => {
    const outstandingTable = document.getElementById('outstanding-services-table');
    const historyTable = document.getElementById('service-history-table');

    const token = localStorage.getItem('accessToken');

    async function fetchClientServices() {
        try {
            const response = await fetch('/business/client-services', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch client services');
            }

            const data = await response.json();
            populateTables(data);
        } catch (error) {
            console.error('Error fetching client services:', error);
        }
    }

    function populateTables(data) {
        outstandingTable.innerHTML = '';
        historyTable.innerHTML = '';

        data.forEach(service => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${service.ClientServiceID}</td>
                <td>${service.Category}</td>
                <td>${service.Description}</td>
                <td>${new Date(service.AssignedDate).toLocaleDateString()}</td>
                <td>${service.DueDate ? new Date(service.DueDate).toLocaleDateString() : 'N/A'}</td>
                <td>${service.PaymentStatus}</td>
                <td>
                    <button class="follow-up-btn" data-email="${service.Email}" data-client-id="${service.ClientID}">
                        Follow Up
                    </button>
                </td>
            `;

            
            if (service.Status === 'Completed') {
                historyTable.appendChild(row);
            } else {
                outstandingTable.appendChild(row);
            }
        });

        attachFollowUpListeners();
    }

    function attachFollowUpListeners() {
        document.querySelectorAll('.follow-up-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const email = button.getAttribute('data-email');
                const clientId = button.getAttribute('data-client-id');

                const message = prompt(`Send a follow-up message to ${email}:`);
                if (message) {
                    try {
                        await sendFollowUpEmail(email, clientId, message);
                        alert('Follow-up email sent successfully!');
                    } catch (error) {
                        console.error('Error sending follow-up email:', error);
                        alert('Failed to send email.');
                    }
                }
            });
        });
    }

    async function sendFollowUpEmail(email, clientId, message) {
        const response = await fetch('/services/follow-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, clientId, message })
        });

        if (!response.ok) {
            throw new Error('Failed to send follow-up email');
        }

        return response.json();
    }


    fetchClientServices();
});
