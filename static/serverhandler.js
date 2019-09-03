// Downloading XML file
$("#loadXmlButton").click(function () {
    console.log("thing: " + $("#monthSelecter").val());
    var month = $("#monthSelecter").val();
    var year = $("#yearSelecter").val();
    
    if (month === "" || year === "") {
        console.log("Value of selected year: " + year);
        console.log("Value of selected month: " + month);
        $("#downloadResult").html("Please select a year and a month!");
        return;
    }

    var date = new Date(year, month, 1);
    window.open(`/getXML?selectedDate=${date}`);
    // $.ajax({
    //     type: "GET",
    //     url : "/getXML",
    //     data: {selectedDate: date},
    //     // dataType : "file",

    //     success : function(msg){
    //         // Changes HTML to have the result
    //         $("#downloadResult").html("Thank you, your download will now start: " + msg);
    //         console.log(msg);
    //     },

    //     // This error will only ever be reached if the user somehow disconnects
    //     error: function(jgXHR, textStatus,errorThrown){
    //         alert("Something weird just went wrong, please try refreshing the page\n(connection lost with server)");
    //         $("#downloadResult").html("Something weird just went wrong, please try refreshing the page\n(connection lost with server)");
    //     }
    // });
});

function loadYears() {
    console.log("LOADING YEARS");
    var selectMenu = $("#yearSelecter");
    var currentYear = new Date().getFullYear();

    for (var i = currentYear; i >= currentYear - 10; i--) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;

        // if (i === currentYear) {
        //     // option.selected = 'selected';
        //     option.setAttribute('selected', 'selected');
        //     console.log("Selected: " + i);
        //     selectMenu.selected = i;
        // }
        selectMenu.append(option);
    }
}

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
            // alert(xhr);
            console.log(xhr);
            //var json = JSON.parse(xhr.responseText);
            alert("Error: " + xhr);
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

    for (var value in body) {
        if (!body[value]) {
            if (!error) {
                error = [];
            }
            error.push(value);
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
            // alert(error);
            $("#insertStatus").html("Error: " + error);
        }
        else {
            // alert("success");
            ajax(url, 'POST', body).done(function(data) {
                console.log(data);
                // alert("success");
                $("#insertStatus").html(data.Status);
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

const getChildInfo = (callback) => {
    var body = { 
        name: document.getElementById("name").value,
        individualID: document.getElementById("individualID").value,
        caseID: document.getElementById("caseID").value
    };

    var error;

    for (var value in body) {
        if (!body[value]) {
            if (!error) {
                error = [];
            }
            error.push(value);
        }
    }

    return callback(error, body);
}

const sendChildInfo = () => {
    var url = "/insertChild";

    getChildInfo(function(err, body) {
        if (err) {
            var error = "Please provide info for ";
            for (var value of err) {
                error += value + ", ";
            }
            $("#insertStatus").html("Error: " + error);
        }
        else {
            ajax(url, 'POST', body).done(function(data) {
                console.log(data);
                $("#insertStatus").html(data.Status);
            });
        }
    });
}