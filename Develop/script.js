$(document).ready(function () {
    $('#modal1').modal();
    $('#modal1').modal('open');
    
});

var modalButton = document.querySelector(".modal-trigger");
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY'
];
var historyResults = [];

var latitude;
var longitude;
var nationalParkApi = "S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF";
var stateCode;
var parkCode = [];

var userInput;

let parkNameSelect = $("#parkNames");
//openWeather APIKey
var apiKey = "c4a186ac3a697bd2fb942f498b34386c";

var nationalParkUrl;

//openWeather OneCall data(temp, humidity, wind speed, wind gusts, precipitation) 
function openWeatherCall(latitude, longitude) {
    var openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=alerts,hourly&appid=c4a186ac3a697bd2fb942f498b34386c`;
    fetch(openWeatherUrl)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // console.log(data);
            if($("#weather").children("li").length > 0) {
                $("#weather").children("li").remove();
            }
            if($("#wind").children("li").length > 0) {
                $("#wind").children("li").remove();
            }
            if($("#precip").children("li").length > 0) {
                $("#precip").children("li").remove();
            }
            let temp = data.current.temp;
            let humidity = data.current.humidity;
            let windSpeed = data.current.wind_speed;
            let windGust = data.current.wind_gust;
            //only found precip on the minutely status
            console.log(data.minutely.length)
            let precip = data.minutely[0].precipitation;
            //append data to designated html element here
            let tempEl = $("<li>");
            tempEl.text("Temperature: " + temp + String.fromCharCode(176) + "F");
            let humidityEl = $("<li>");
            humidityEl.text("Humidity: " + humidity + "%");
            let windSpeedEl = $("<li>");
            windSpeedEl.text("Wind Speed: " + windSpeed + " MPH");
            let windGustEl = $("<li>");
            windGustEl.text("Wind Gust: " + windGust);
            let precipEl = $("<li>");
            precipEl.text("Precipation: " + precip + " mm");
            $("#weather").append(tempEl);
            $("#wind").append(windSpeedEl);
            $("#wind").append(windGustEl);
            $("#precip").append(precipEl);
        });
};

function stateHandler() {
    stateCode = $("#stateDD option:selected").text();
    console.log(stateCode);
    apiParkName(stateCode);
}

function appendSt() {
    const stateDD = document.querySelector('#stateDD');
    for (i = 0; i < stateCodes.length; i++) {
        var createOption = document.createElement('option');
        createOption.textContent = stateCodes[i];
        stateDD.append(createOption);
    }
    if(stateDD.getAttribute("listener") !== 'true') {
        // console.log('adding listener');
        stateDD.addEventListener("change", stateHandler);
    }else {
        // console.log("didn't add listener");
        return;
    }
};

function apiParkName(stateCode) {
    console.log("getting park names to populate dropdown");
    nationalParkUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${nationalParkApi}`;
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            $('#parkNames option:not(:first)').remove();
            for (let i = 0; i < callData.data.length; i++) {
                // append the names to drop down box here
                let parkNameOption = $("<option>");
                parkNameOption.text(callData.data[i].fullName);
                parkNameSelect.append(parkNameOption);
            }
            const modalContent = document.querySelector("#submit");
            if(modalContent.getAttribute("listener") !== 'true') {
                console.log("adding listener")
                modalContent.addEventListener("click", apiCallName);
            }else {
                return;
            }
        })
}

function apiCallName() {
    console.log("apiCallName being called");
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            
            let userInput = parkHandler();
            console.log(userInput);
            console.log(callData.data.length);
            let i = 0;
            for (i; i < callData.data.length; i++) {
                if (userInput == callData.data[i].fullName) {
                    break;
                }
            }
            $(".parkName").text(userInput);
            let image = callData.data[i].images[Math.floor(Math.random() * callData.data[i].images.length)].url;
            console.log(image);
            $(".rowBox").css("background-image", "url(" + image + ")");
            $(".rowBox").css("position", "relative");
            $(".rowBox").css("z-index", 0);
            latitude = callData.data[i].latitude;
            longitude = callData.data[i].longitude;
            let code = callData.data[i].parkCode
            storeResults(userInput, code);
            // one call and wildfire call goes here passing the lat and long
            wildfireCall(latitude, longitude);
            openWeatherCall(latitude, longitude);
        });
}

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
            console.log(data);
            console.log(data.message);
            if($("#wildFire").children("li").length > 0) {
                $("#wildFire").children("li").remove();
            }
            // $("#wildFire").text("Wildfire");
            let wildfireEl = $("<li>");
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

function storeResults(parkName, code) {
    // console.log(parkName);
    historyResults.push(parkName);
    parkCode.push(code);
    localStorage.setItem("input", JSON.stringify(historyResults));
    localStorage.setItem("code", JSON.stringify(parkCode));
    return;
}

function getResults() {
    console.log("history buttons");
    $(".historyBtn").remove();
    historyResults = JSON.parse(localStorage.getItem("input"));
    console.log(historyResults);
    if (historyResults !== null) {
        for (let i = 0; i < historyResults.length; i++) {
            let historyBtn = $("<button>");
            let singleParkCode = getParkCode(i);
            historyBtn.attr("class", "historyBtn");
            historyBtn.addClass("submit");
            historyBtn.attr("id", singleParkCode);
            historyBtn.text(historyResults[i]);
            $(".pastSearches").append(historyBtn);
        }
        $(".historyBtn").on("click", historyHandler);
    } else {
        return historyResults = [];
    }
}

function getParkCode(i) {
    parkCode = JSON.parse(localStorage.getItem("code"));
    if(parkCode !== null) {
        return parkCode[i];
    } else {
        return parkCode = [];
    }
}

function historyHandler() {
    // console.log($(this));
    parkCode = $(this).attr("id");
    var historyUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${nationalParkApi}`;
    historyFetch(historyUrl);
}

function historyFetch(historyUrl) {
    console.log("history fetch");
    fetch(historyUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            console.log("fetch call worked");
            let userInput = callData.data[0].fullName;
            console.log(userInput);
            console.log(callData.data.length);
            let i = 0;
            for (i; i < callData.data.length; i++) {
                console.log(callData.data[i].fullName);
                if (userInput == callData.data[i].fullName) {
                    console.log(i, "name matches!");
                    break;
                }
            }
            $(".parkName").text(userInput);
            let image = callData.data[i].images[Math.floor(Math.random() * callData.data[i].images.length)].url;
            $(".rowBox").css("background-image", "url(" + image + ")");
            $(".rowBox").css("position", "relative");
            $(".rowBox").css("z-index", 0);
            latitude = callData.data[i].latitude;
            longitude = callData.data[i].longitude;
            console.log(latitude, longitude);
            // one call and wildfire call goes here passing the lat and long
            wildfireCall(latitude, longitude);
            openWeatherCall(latitude, longitude);
        });
}

function parkHandler() {
    let userInput = $("#parkNames option:selected").text();
    console.log(userInput);
    return userInput;
}

appendSt();
getResults();
