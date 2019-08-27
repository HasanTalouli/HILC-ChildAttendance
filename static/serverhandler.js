//base ajax function
const ajax = (uri, method, data) => {
    var request = {
        url: uri,
        type: method,
        contentType: "application/json",
        accepts: "application/json",
        cache: true,
        dataType: 'json',
        data: JSON.stringify(data),
        error: function(xhr) {
            var json = JSON.parse(xhr.responseText);
            alert("Error: " + xhr.status + ", " + json.error);
        }
    };
    return $.ajax(request);
}

const getStudents = () => {
    var url = "";
    ajax(url, 'GET').done(function(data) {

    });
}

const sendAttendance = () => {
    var url = "";
    var data = {
        childId: $("#"),
        date: $("#"),
        timeIn: $("#"),
        timeOut: $("#"),
        status: $("#"),
        dayNight: $("#")
    };

    ajax(url, 'POST', data).done(function(data) {
        
    });
}