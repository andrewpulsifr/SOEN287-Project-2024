
let currentClientId = 1;
let requests = [
    {
        clientId: 1,
        serviceName: "Service Title 1",
        price: "$50.00",
        completed: false
    },
    {
        clientId: 1,
        serviceName: "Service Title 2",
        price: "$75.00",
        completed: true
    }
];


function displayRequests(clientId) {
    const requestList = document.querySelector(".request-list");
    requestList.innerHTML = "";

    requests.filter(request => request.clientId === clientId).forEach(request => {
        const row = document.createElement("tr");
        row.classList.add("request-item");

        let status;
        let cancelButtonDisabled = '';

        if (request.completed) {
            status = "Completed";
            cancelButtonDisabled = 'disabled';
        } else {
            status = "In Progress";
            cancelButtonDisabled = '';
        }
        row.innerHTML = `
            <td class="service-title">${request.serviceName}</td>
            <td class="service-price">${request.price}</td>
            <td>${status}</td>
            <td>
                <button class="cancel-button" ${cancelButtonDisabled} onclick="cancelRequest('${request.serviceName}')">
                    Cancel
                </button>
            </td>
        `;

        requestList.appendChild(row);
    });
}

function cancelRequest(button) {
    const requestItem = button.closest('.request-item');
    const serviceName = requestItem.querySelector('.service-title').textContent;
    const requestIndex = requests.findIndex(request => request.serviceName === serviceName && !request.completed);
    if (requestIndex !== -1) {
        requests.splice(requestIndex, 1); 
        displayRequests(currentClientId); 
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayRequests(currentClientId); 
});