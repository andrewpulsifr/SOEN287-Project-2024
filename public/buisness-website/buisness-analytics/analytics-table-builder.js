
var outstandingServices = [
    {'orderNumber': 'SR-20241010-001', 'category': 'Plumbing', 'description': 'Leaky faucet repair', 'dateOfRequest': '10/10/2024', 'dueDate': '10/15/2024', 'paymentStatus': 'unpaid'},
    {'orderNumber': 'SR-20240911-002', 'category': 'Drywall', 'description': 'Wall crack fix', 'dateOfRequest': '09/11/2024', 'dueDate': '09/20/2024', 'paymentStatus': 'paid'},
    {'orderNumber': 'SR-20240821-003', 'category': 'Gardening', 'description': 'Lawn mowing service', 'dateOfRequest': '08/21/2024', 'dueDate': '08/25/2024', 'paymentStatus': 'paid'},
    {'orderNumber': 'SR-20240723-004', 'category': 'Painting', 'description': 'Exterior painting', 'dateOfRequest': '07/23/2024', 'dueDate': '07/30/2024', 'paymentStatus': 'unpaid'},
    {'orderNumber': 'SR-20240615-005', 'category': 'Electrical', 'description': 'Light fixture installation', 'dateOfRequest': '06/15/2024', 'dueDate': '06/20/2024', 'paymentStatus': 'unpaid'},
    {'orderNumber': 'SR-20240510-006', 'category': 'Window Cleaning', 'description': 'Window cleaning service', 'dateOfRequest': '05/10/2024', 'dueDate': '05/15/2024', 'paymentStatus': 'unpaid'},
];

var serviceHistory = [
    {'orderNumber': 'SH-20231210-001', 'category': '23', 'description': 'Air conditioner maintenance', 'dateOfRequest': '12/10/2023', 'dateFulfilled': '12/15/2023', 'paymentStatus': 'paid'},
    {'orderNumber': 'SH-20231105-002', 'category': 'Roofing', 'description': 'Shingle replacement', 'dateOfRequest': '11/05/2023', 'dateFulfilled': '11/10/2023', 'paymentStatus': 'paid'},
    {'orderNumber': 'SH-20231015-003', 'category': 'Pest Control', 'description': 'Termite inspection', 'dateOfRequest': '10/15/2023', 'dateFulfilled': '10/20/2023', 'paymentStatus': 'paid'},
    {'orderNumber': 'SH-20230912-004', 'category': 'Flooring', 'description': 'Hardwood floor refinishing', 'dateOfRequest': '09/12/2023', 'dateFulfilled': '09/18/2023', 'paymentStatus': 'unpaid'},
    {'orderNumber': 'SH-20230801-005', 'category': 'Appliance Repair', 'description': 'Refrigerator repair', 'dateOfRequest': '08/01/2023', 'dateFulfilled': '08/03/2023', 'paymentStatus': 'paid'},
    {'orderNumber': 'SH-20230701-006', 'category': 'Landscaping', 'description': 'Tree removal service', 'dateOfRequest': '07/01/2023', 'dateFulfilled': '07/05/2023', 'paymentStatus': 'unpaid'},
];

$('#outstanding-search-input').on('keyup', function(){
    var value = $(this).val();
    var column = $('#outstanding-column-select').val(); // Get selected column
    var data = searchTable(value, outstandingServices, column);
    buildOutstandingServicesTable(data);
})

$('#service-history-input').on('keyup', function(){
    var value = $(this).val();
    var column = $('#history-column-select').val(); // Get selected column
    var data = searchTable(value, serviceHistory,column);
    buildServiceHistoryTable(data);
})


buildOutstandingServicesTable(outstandingServices);
buildServiceHistoryTable(serviceHistory);


function searchTable(value, data, column){
    var filteredData = [];

    for ( var i = 0; i < data.length; i++){
       value = value.toLowerCase();
       var field = data[i][column].toString().toLowerCase(); // Access selected column dynamically

       if(field.includes(value)){
            filteredData.push(data[i]);
       }
    }
    return filteredData;
}
function buildOutstandingServicesTable(data){
    var table = document.getElementById('outstanding-services-table');

    table.innerHTML= '';

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i].orderNumber}</td>
                        <td>${data[i].category}</td>
                        <td>${data[i].description}</td>
                        <td>${data[i].dateOfRequest}</td>
                        <td>${data[i].dueDate}</td>
                        <td>${data[i].paymentStatus}</td>
                  </tr>`
        table.innerHTML += row
    }
}

function buildServiceHistoryTable(data){
    var table = document.getElementById('service-history-table');

    table.innerHTML= '';

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i].orderNumber}</td>
                        <td>${data[i].category}</td>
                        <td>${data[i].description}</td>
                        <td>${data[i].dateOfRequest}</td>
                        <td>${data[i].dateFulfilled}</td>
                        <td>${data[i].paymentStatus}</td>
                  </tr>`
        table.innerHTML += row
    }
}

