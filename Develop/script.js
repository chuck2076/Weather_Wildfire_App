// makes modal open on page load rather than clicking trigger to make modal appear
$(document).ready(function () {
    $('#modal1').modal();
    $('#modal1').modal('open');
    
});
// not sure what this variable does but leaving it in comment in case we need it again
// var modalButton = document.querySelector(".modal-trigger");

// state code array to be printed onto the dropdown box
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY'
];
// empty array for park name local storage 
var historyResults = [];
// global variables to be used later in functions to prevent scope issues
var latitude;
var longitude;
var nationalParkApi = "S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF";
var stateCode;
var parkCode = [];

var userInput;

var parkNameSelect = $("#parkNames");
//openWeather APIKey
// var apiKey = "c4a186ac3a697bd2fb942f498b34386c";

var nationalParkUrl;

//openWeather OneCall data(temp, humidity, wind speed, wind gusts, precipitation) 
function openWeatherCall(latitude, longitude) {
    var openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=alerts,hourly&appid=c4a186ac3a697bd2fb942f498b34386c`;
    fetch(openWeatherUrl)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // if structure that tests if there is already existing data on the cards and if so to remove them so new data can be added to the cards
            if($("#weather").children("li").length > 0) {
                $("#weather").children("li").remove();
            }
            if($("#wind").children("li").length > 0) {
                $("#wind").children("li").remove();
            }
            if($("#precip").children("li").length > 0) {
                $("#precip").children("li").remove();
            }
            // getting data from OneCall and storing them in variables to use later
            let temp = data.current.temp;
            let humidity = data.current.humidity;
            let windSpeed = data.current.wind_speed;
            let windGust = data.current.wind_gust;
            let precip = data.minutely[0].precipitation;
            //append data to designated html element here
            let tempEl = $("<li>");
            // string.fromcharcode just gives the degree symbol
            tempEl.text("Temperature: " + temp + String.fromCharCode(176) + "F");
            let humidityEl = $("<li>");
            humidityEl.text("Humidity: " + humidity + "%");
            let windSpeedEl = $("<li>");
            windSpeedEl.text("Wind Speed: " + windSpeed + " MPH");
            let windGustEl = $("<li>");
            windGustEl.text("Wind Gust: " + windGust);
            let precipEl = $("<li>");
            precipEl.text("Precipation: " + precip + " mm");
            // appending the elements in the correct cards
            $("#weather").append(tempEl);
            $("#wind").append(windSpeedEl);
            $("#wind").append(windGustEl);
            $("#precip").append(precipEl);
        });
};

// this function handles the functionality for when the user chooses a state to search from
function stateHandler() {
    stateCode = $("#stateDD option:selected").text();
    apiParkName(stateCode);
}

// renders all the different state codes the user can use for the NPS API
function appendSt() {
    const stateDD = document.querySelector('#stateDD');
    for (i = 0; i < stateCodes.length; i++) {
        var createOption = document.createElement('option');
        createOption.textContent = stateCodes[i];
        stateDD.append(createOption);
    }
    // not sure if this works, but the results aren't doing double/third searches anymore so keeping it in here
    if(stateDD.getAttribute("listener") !== 'true') {
        stateDD.addEventListener("change", stateHandler);
    }else {
        return;
    }
};

// function gets the park names after the user chooses what state they want to search in
function apiParkName(stateCode) {
    nationalParkUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${nationalParkApi}`;
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            $('#parkNames option:not(:first)').remove();
            // goes through all of the park names in the state that the user searched for and puts it in the second dropdown box
            for (let i = 0; i < callData.data.length; i++) {
                // append the names to drop down box here
                let parkNameOption = $("<option>");
                parkNameOption.text(callData.data[i].fullName);
                parkNameSelect.append(parkNameOption);
            }
            const modalContent = document.querySelector("#submit");
            // not sure if this works, but no more problems with the double fetching so keeping it in as well
            if(modalContent.getAttribute("listener") !== 'true') {
                modalContent.addEventListener("click", apiCallName);
            }else {
                return;
            }
        })
}

// function that gets the data from park after a park has been chosen by user
function apiCallName() {
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            // parkHandler deals with getting the park name from drop down box and putting that name into a variable
            let userInput = parkHandler();
            let i = 0;
            // checks to make sure the user input is the same as the park name that was fetched
            for (i; i < callData.data.length; i++) {
                if (userInput == callData.data[i].fullName) {
                    break;
                }
            }
            // writing and apendding data from API onto the page
            $(".parkName").text(userInput);
            let image = callData.data[i].images[Math.floor(Math.random() * callData.data[i].images.length)].url;
            $(".rowBox").css("background-image", "url(" + image + ")");
            $(".rowBox").css("position", "relative");
            $(".rowBox").css("z-index", 0);
            latitude = callData.data[i].latitude;
            longitude = callData.data[i].longitude;
            let code = callData.data[i].parkCode;
            // stores the park name and the park code for later use into local storage as a psuedo search history
            storeResults(userInput, code);
            // one call and wildfire call goes here passing the lat and long
            wildfireCall(latitude, longitude);
            openWeatherCall(latitude, longitude);
        });
}

// fetches the wildfire data from wildfire API
function wildfireCall(latitude, longitude) {

    var wildfireUrl = `https://api.ambeedata.com/latest/fire?lat=${latitude}&lng=${longitude}`;
    fetch(wildfireUrl, {
            "method": "GET",
            "headers": {
                "x-api-key": "4fd71a9226eb5db201124af457f8efe834d262c977ad3178d2c681b433e7a6af",
                "Content-type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        }).then(function (data) {
            // checks for exsiting data elements on page and removes them if true
            if($("#wildFire").children("li").length > 0) {
                $("#wildFire").children("li").remove();
            }
            // $("#wildFire").text("Wildfire");
            // creating and appending data to html
            let wildfireEl = $("<li>");
            // checks to see fit there were any fires recorded in the area and if so prints out the danger, else prints out no fires were detected
            if (data.message !== "No fires were detected") {
                wildfireEl.text("Confidence: " + data.data[0].confidence);
                $("#wildFire").append(wildfireEl);
            } else {
                wildfireEl.text(data.message);
                $("#wildFire").append(wildfireEl);
            }
            getResults();
        })
        .catch(err => {
            console.error(err);
        });
}

// deals with storing both the park name and park code into local storage as an array
function storeResults(parkName, code) {
    historyResults.push(parkName);
    parkCode.push(code);
    localStorage.setItem("input", JSON.stringify(historyResults));
    localStorage.setItem("code", JSON.stringify(parkCode));
    return;
}

// renders anything in local storage onto the page as a search history
function getResults() {
    // removes any exsiting search history to update any new items stored into the arrays
    $(".historyBtn").remove();
    // grabs park names from localstorage
    historyResults = JSON.parse(localStorage.getItem("input"));
    if (historyResults !== null) {
        // iterates over the array until the end of park names array
        for (let i = 0; i < historyResults.length; i++) {
            let historyBtn = $("<button>");
            // grabs the park code at the same position of the park name because they were stored at the same time
            let singleParkCode = getParkCode(i);
            historyBtn.attr("class", "historyBtn");
            historyBtn.addClass("submit");
            // puts the park code as a unique id of the html element
            historyBtn.attr("id", singleParkCode);
            // prints the park name onto the button
            historyBtn.text(historyResults[i]);
            $(".pastSearches").append(historyBtn);
        }
        // event listener on the buttons for user to pull up the park again
        $(".historyBtn").on("click", historyHandler);
        // if nothing in local storage return the variable as empty array to be used by storeResults
    } else {
        return historyResults = [];
    }
}

// handles how to get park code from local storage in conjunction with getting the park names from local storage at the same time
function getParkCode(i) {
    parkCode = JSON.parse(localStorage.getItem("code"));
    if(parkCode !== null) {
        return parkCode[i];
    } else {
        return parkCode = [];
    }
}

// handles functionality for when user clicks on the search history buttons
function historyHandler() {
    // grabs the unique id on element which is the park code to be used for the api call to get the data
    parkCode = $(this).attr("id");
    var historyUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${nationalParkApi}`;
    historyFetch(historyUrl);
}

// deals with fetches that happens for the search history buttons
function historyFetch(historyUrl) {
    fetch(historyUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            let userInput = callData.data[0].fullName;
            let i = 0;
            for (i; i < callData.data.length; i++) {
                if (userInput == callData.data[i].fullName) {
                    break;
                }
            }
            $(".parkName").text(userInput);
            // randomizes what images to choose from the API so you hopefully don't get the same image on back to back searches of same park
            let image = callData.data[i].images[Math.floor(Math.random() * callData.data[i].images.length)].url;
            // sets image as background image in css
            $(".rowBox").css("background-image", "url(" + image + ")");
            $(".rowBox").css("position", "relative");
            $(".rowBox").css("z-index", 0);
            latitude = callData.data[i].latitude;
            longitude = callData.data[i].longitude;
            // one call and wildfire call goes here passing the lat and long
            wildfireCall(latitude, longitude);
            openWeatherCall(latitude, longitude);
        });
}

// grabs text from the park name drop down box and returns it 
function parkHandler() {
    let userInput = $("#parkNames option:selected").text();
    return userInput;
}

appendSt();
getResults();
