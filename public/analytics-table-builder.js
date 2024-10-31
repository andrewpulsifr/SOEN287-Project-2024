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
buildOutstandingServicesTable(outstandingServicesList);
buildServiceHistoryTable(serviceHistoryList);

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

/****************************************************************
   Date filter event handlers
****************************************************************/

// Update event handlers to show date range inputs when appropriate
$('#outstanding-column-select').on('change', function(){
    var selectedColumn = $(this).val();
    toggleDateInputs(selectedColumn, '#outstanding-search-input', '#outstanding-date-range-start', '#outstanding-date-range-end');
    buildOutstandingServicesTable(outstandingServicesList);
});

$('#history-column-select').on('change', function(){
    var selectedColumn = $(this).val();
    toggleDateInputs(selectedColumn, '#service-history-input', '#service-history-range-start', '#service-history-range-end');
    buildServiceHistoryTable(serviceHistoryList);
});

// Replace non-jQuery event handlers for date range inputs
$('#outstanding-date-range-start, #outstanding-date-range-end').on('change', function() {
    const selectedColumn = $('#outstanding-column-select').val();
    const filteredData = filterByDateRange(outstandingServicesList, selectedColumn, 'outstanding-date-range-start', 'outstanding-date-range-end');
    buildOutstandingServicesTable(filteredData);
});

// Event handlers for service history date range using jQuery
$('#service-history-range-start, #service-history-range-end').on('change', function() {
    const selectedColumn = $('#history-column-select').val();
    const filteredData = filterByDateRange(serviceHistoryList, selectedColumn, 'service-history-range-start', 'service-history-range-end');
    buildServiceHistoryTable(filteredData);
});

function filterByDateRange(data,selectedColumn,startDateSelector,endDateSelector) {
    const startDateElem = document.getElementById(startDateSelector);
    const startDate = startDateElem.value ? new Date(startDateElem.value) : null;
    const endDateElem = document.getElementById(endDateSelector);
    const endDate = endDateElem.value ? new Date(endDateElem.value) : null;

    filteredData = data.filter( item => {
        const date = item[selectedColumn];
        return (startDate ? date.getTime() >= startDate.getTime() : true) && (endDate ? date.getTime() <= endDate.getTime() : true);
    });
    return filteredData;
}

// Toggle visibility of date inputs based on selected column
function toggleDateInputs(selectedColumn, textInput, dateStart, dateEnd) {
    if (selectedColumn === 'dateOfRequest' || selectedColumn === 'dueDate' || selectedColumn === 'dateFulfilled') {
        $(textInput).hide();
        $(dateStart).show();
        $(dateEnd).show();
    } else {
        $(dateStart).hide();
        $(dateEnd).hide();
        $(textInput).show();
    }
}

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
        var followUpButton = data[i].paymentStatus === 'unpaid'
         ? `<button class="btn btn-info follow-up-btn" data-order="${data[i].orderNumber}">Follow Up</button>`
            : '<span></span>';
        var row = `<tr>
                        <td>${data[i].orderNumber}</td>
                        <td>${data[i].category}</td>
                        <td>${data[i].description}</td>
                        <td>${data[i].dateOfRequest ? data[i].dateOfRequest.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].dueDate ? data[i].dueDate.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].paymentStatus}</td>
                        <td>${followUpButton}
                  </tr>`
        table.innerHTML += row
    }
    document.querySelectorAll('.follow-up-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-order');
            handleFollowUp(orderNumber);
        });
    });
}

function handleFollowUp(orderNumber) {
    alert(`Follow up initiated for order: ${orderNumber}`);
    
}
function buildServiceHistoryTable(data){
    var table = document.getElementById('service-history-table');

    table.innerHTML= '';

    for (var i = 0; i < data.length; i++){
        var followUpButton = data[i].paymentStatus === 'unpaid'
         ? `<button class="btn btn-info follow-up-btn" data-order="${data[i].orderNumber}">Follow Up</button>`
            : '<span></span>';
        var row = `<tr>
                        <td>${data[i].orderNumber}</td>
                        <td>${data[i].category}</td>
                        <td>${data[i].description}</td>
                        <td>${data[i].dateOfRequest ? data[i].dateOfRequest.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].dateFulfilled ? data[i].dateFulfilled.toISOString().split('T')[0] : ''}</td>
                        <td>${data[i].paymentStatus}</td>
                        <td>${followUpButton}
                  </tr>`
        table.innerHTML += row
    }
    document.querySelectorAll('.follow-up-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-order');
            handleFollowUp(orderNumber);
        });
    });
}

