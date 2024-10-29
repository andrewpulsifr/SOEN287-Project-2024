/****************************************************************
    Service classes
****************************************************************/

class Service {
    constructor(orderNumber, category, description, dateOfRequest, paymentStatus) {
        this.orderNumber = orderNumber;
        this.category = category;
        this.description = description;
        this.dateOfRequest = new Date(dateOfRequest);
        this.paymentStatus = paymentStatus;
    }
}

class outstandingService extends Service {
    constructor(orderNumber, category, description, dateOfRequest, dueDate, paymentStatus) {
        super(orderNumber, category, description, dateOfRequest, paymentStatus);
        this.dueDate = dueDate? new Date(dueDate) : null;
    }
}

class serviceHistory extends Service {
    constructor(orderNumber, category, description, dateOfRequest, dateFulfilled, paymentStatus) {
        super(orderNumber, category, description, dateOfRequest, paymentStatus);
        this.dateFulfilled = dateFulfilled? new Date(dateFulfilled) : null;
    }
}

/****************************************************************
    Data list and initialization of service
****************************************************************/

const outstandingData = [
    ['SR-20241010-001', 'Plumbing', 'Leaky faucet repair', new Date('2024-10-10'), new Date('2024-10-15'), 'unpaid'],
    ['SR-20240911-002', 'Drywall', 'Wall crack fix', new Date('2024-09-11'), new Date('2024-09-20'), 'paid'],
    ['SR-20240821-003', 'Gardening', 'Lawn mowing service', new Date('2024-08-21'), new Date('2024-08-25'), 'paid'],
    ['SR-20240723-004', 'Painting', 'Exterior painting', new Date('2024-07-23'), new Date('2024-07-30'), 'unpaid'],
    ['SR-20240615-005', 'Electrical', 'Light fixture installation', new Date('2024-06-15'), new Date('2024-06-20'), 'unpaid'],
    ['SR-20240510-006', 'Window Cleaning', 'Window cleaning service', new Date('2024-05-10'), new Date('2024-05-15'), 'unpaid']
];

// Instantiate outstanding services list
const outstandingServicesList = outstandingData.map(data => 
    new outstandingService(...data)
);

const historyData = [
    ['SH-20231210-001', 'HVAC', 'Air conditioner maintenance', new Date('2023-12-10'), new Date('2023-12-15'), 'paid'],
    ['SH-20231105-002', 'Roofing', 'Shingle replacement', new Date('2023-11-05'), new Date('2023-11-10'), 'paid'],
    ['SH-20231015-003', 'Pest Control', 'Termite inspection', new Date('2023-10-15'), new Date('2023-10-20'), 'paid'],
    ['SH-20230912-004', 'Flooring', 'Hardwood floor refinishing', new Date('2023-09-12'), new Date('2023-09-18'), 'unpaid'],
    ['SH-20230801-005', 'Appliance Repair', 'Refrigerator repair', new Date('2023-08-01'), new Date('2023-08-03'), 'paid'],
    ['SH-20230701-006', 'Landscaping', 'Tree removal service', new Date('2023-07-01'), new Date('2023-07-05'), 'unpaid']
];

// Instantiate service history list
const serviceHistoryList = historyData.map(data => 
    new serviceHistory(...data)
);

/****************************************************************
    Event handlers for filtering services
****************************************************************/

$('#outstanding-search-input').on('keyup', function(){
    var value = $(this).val();
    var column = $('#outstanding-column-select').val(); // Get selected column
    var data = searchTable(value, outstandingServicesList, column);
    buildOutstandingServicesTable(data);
})

$('#service-history-input').on('keyup', function(){

    var value = $(this).val();
    var column = $('#history-column-select').val(); // Get selected column
    var data = searchTable(value, serviceHistoryList,column);
    buildServiceHistoryTable(data);
})

buildOutstandingServicesTable(outstandingServicesList);
buildServiceHistoryTable(serviceHistoryList);


function searchTable(value, data, column){
    var filteredData = [];
    value = value.toLowerCase();

    for ( var i = 0; i < data.length; i++){
        let field = '';
        // Dynamically choose the column to search based on the selected column
        switch (column) {
            case 'orderNumber':
                field = data[i].orderNumber.toLowerCase();
                break;
            case 'category':
                field = data[i].category.toLowerCase();
                break;
            case 'description':
                field = data[i].description.toLowerCase();
                break;
            case 'dateOfRequest':
                field = data[i].dateOfRequest.toISOString().split('T')[0].toLowerCase();
                break;
            case 'dueDate':
                field = data[i].dueDate ? data[i].dueDate.toISOString().split('T')[0].toLowerCase() : '';
                break;
            case 'dateFulfilled':
                field = data[i].dateFulfilled ? data[i].dateFulfilled.toISOString().split('T')[0].toLowerCase() : '';
                break;
            case 'paymentStatus':
                field = data[i].paymentStatus.toLowerCase();
                break;
            default:
                field = '';
}
       if(field.includes(value)){
            filteredData.push(data[i]);
       }
    }
    return filteredData;
}

/****************************************************************
    Table Populating Functions
****************************************************************/
function buildOutstandingServicesTable(data){
    var table = document.getElementById('outstanding-services-table');

    table.innerHTML= '';

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i].orderNumber}</td>
                        <td>${data[i].category}</td>
                        <td>${data[i].description}</td>
                        <td>${data[i].dateOfRequest ? data[i].dateOfRequest.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].dueDate ? data[i].dueDate.toISOString().split('T')[0] : ''}</td>
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
                        <td>${data[i].dateOfRequest ? data[i].dateOfRequest.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].dateFulfilled ? data[i].dateFulfilled.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].paymentStatus}</td>
                  </tr>`
        table.innerHTML += row
    }
}

