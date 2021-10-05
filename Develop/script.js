$(document).ready(function () {
    $('.modal').modal();
});

// var instance = M.Modal.getInstance('modal');
// instance.open('modal');
var stateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY'
];

//openWeather API
var apiKey = "c4a186ac3a697bd2fb942f498b34386c";
//grabbing text input box 
var searchInput = document.querySelector('#searchInput');
var searchResults = document.querySelector("#searchResults");
//query Url to call openWeather API with concatenated (value of text input search) and (apiKey) parameters
var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + "austin" + "&appid=" + apiKey;

// fetch(queryUrl)
//     .then (response => response.json())
//     .then (data => console.log(data))
// .catch(err => alert('Incorrect coordinates!'))
// console.log(data);

// using nps api: https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF searching by state initials



var latitude;
var longitude;
var nationalParkApi = "S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF";
var stateCode = "CA";


var nationalParkUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${nationalParkApi}`;

var nationalParkName = "Presidio of San Francisco";

let parkNameSelect = $("#parkNames");

function apiParkName() {
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
                    console.log(parkNameOption);
                    console.log(parkNameSelect);
                    parkNameSelect.append(parkNameOption);
            }
            $(".modal-content").on("click", "#submit", apiCallName);
        })
}


function apiCallName() {
    fetch(nationalParkUrl)
        .then(function (response) {
            return response.json();
        }).then(function (callData) {
            console.log("fetch call worked");
            let userInput = $("#parkNames option:selected").text();
            console.log(userInput);
            console.log(latitude, longitude,);
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
            longitude = callData.data[i].latitude;
            // one call and wildfire call goes here passing the lat and long
            console.log("Out of the loop");
            // console.log(latitude, longitude, i);
            wildfireCall(latitude, longitude);
        });
}

// apiParkName();

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

$(".modal-trigger").on("click", apiParkName);