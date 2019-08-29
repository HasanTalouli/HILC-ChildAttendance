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
            alert(xhr);
            //var json = JSON.parse(xhr.responseText);
            alert("Error");
        }
    };
    return $.ajax(request);
}

const getInfo = (callback) => {
    var body = {
        individualID: document.getElementById("childSelect").value,
        dateOfCare: document.getElementById("date").value,
        timeIn: document.getElementById("timeIn").value,
        timeOut: document.getElementById("timeOut").value,
        attendance: document.getElementById("attendance").value,
        dayOrNight: document.getElementById("dayNight").value
    };

    var error;

    // make sure values are inputted properly
    if (body.attendance == "A") {
        if (!body.individualID) {
            if (!error) {
                error = [];
            }
            error.push("individualID");
        }
        if (!body.dateOfCare) {
            if (!error) {
                error = [];
            }
            error.push("dateOfCare");
        }
    }
    else {
        for (var value in body) {
            if (!body[value]) {
                if (!error) {
                    error = [];
                }
                error.push(value);
            }
        }
    }

    return callback(error, body);
}

const getStudents = () => {
    var url = "./getChildren";

    ajax(url, 'GET').done(function(data) {
        console.log(data);
        var selectHTML = "";

        for (var student of data) {
            selectHTML += "<option value=\"" + student.individualID + "\">" + student.name + "</option>";
        }

        var output = document.getElementById("childSelect");
        output.innerHTML = selectHTML;
    });
}

const sendAttendance = () => {
    var url = "/attendance";
    
    getInfo(function(err, body) {
        if (err) {
            var error = "Please provide info for ";
            for (var value of err) {
                error += value + ", ";
            }
            alert(error);
        }
        else {
            alert("success");
            ajax(url, 'POST', body).done(function(data) {
                console.log(data);
                alert("success");
            });
        }
    });
}

const resetForm = () => {
    document.getElementById("date").value = null;
    document.getElementById("timeIn").value = null;
    document.getElementById("timeOut").value = null;
    document.getElementById("attendance").value = null;
    document.getElementById("dayNight").value = null;
}