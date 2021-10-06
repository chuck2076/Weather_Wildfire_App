// $(document).ready(function () {
//     $('.modal').modal();
// });

$(document).ready(function(){
    $('#modal1').modal();
    $('#modal1').modal('open'); 
 });

// var instance = M.Modal.getInstance('modal');
// instance.open('modal');
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

var userInput;

// var nationalParkName = "Presidio of San Francisco";

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
            console.log(data);

            let temp = data.current.temp;
            let humidity = data.current.humidity;
            let windSpeed = data.current.wind_speed;
            let windGust = data.current.wind_gust;
            //only found precip on the minutely status
            let precip = data.minutely[0].precipitation;

            //append data to designated html element here
            console.log(temp, humidity, windSpeed, windGust, precip);

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
        stateDD.append(createOption)
    }
    stateDD.addEventListener("change", stateHandler);
};

function apiParkName(stateCode) {
    console.log("getting park names to populate dropdown");
    nationalParkUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${nationalParkApi}`;
    console.log(nationalParkUrl);
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            $('#parkNames option:not(:first)').remove();
            for (let i = 0; i < callData.data.length; i++) {
                console.log(callData.data[i].fullName);
                // append the names to drop down box here
                let parkNameOption = $("<option>");
                parkNameOption.text(callData.data[i].fullName);
                // console.log(parkNameOption);
                // console.log(parkNameSelect);
                parkNameSelect.append(parkNameOption);
            }
            // return nationalParkUrl
            $(".modal-content").on("click", "#submit", apiCallName);
        })
}

function apiCallName() {
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            console.log("fetch call worked");
            let userInput = parkHandler();
            // let userInput = selectEl.text();
            console.log(userInput);
            // console.log(latitude, longitude);
            console.log(callData.data.length);
            let i = 0;
            for (i; i < callData.data.length; i++) {
                console.log(callData.data[i].fullName);
                if (userInput == callData.data[i].fullName) {
                    console.log(i, "name matches!");
                    // console.log(callData.data[i].latitude, callData.data[i].longitude);
                    break;
                }
            }
            console.log(callData.data[i].images);
            let image = callData.data[i].images[Math.floor(Math.random() * callData.data[i].images.length)].url;
            console.log(image);
            latitude = callData.data[i].latitude;
            longitude = callData.data[i].longitude;
            console.log(latitude, longitude);
            // one call and wildfire call goes here passing the lat and long
            console.log("Out of the loop");
            storeResults(userInput);
            // console.log(latitude, longitude, i);
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
            console.log(response);
            return response.json();
        }).then(function (data) {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
}

function storeResults(parkName) {
    console.log(parkName);
    historyResults.push(parkName);
    localStorage.setItem("input", JSON.stringify(historyResults));
}

function parkHandler() {
    let userInput = $("#parkNames option:selected").text();
    return userInput;
}


modalButton.addEventListener("click", appendSt);