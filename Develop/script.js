
//openWeather API
//my apiKey = c4a186ac3a697bd2fb942f498b34386c
var apiKey = "c4a186ac3a697bd2fb942f498b34386c";
//grabbing text input box 
searchInput = document.querySelector('#searchInput');
//query Url to call openWeather API with concatenated (value of text input search) and (apiKey) parameters
var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q="+"austin"+"&appid="+apiKey;

fetch(queryUrl)
    .then (response => response.json())
    .then (data => console.log(data))
.catch(err => alert('Incorrect coordinates!'))
console.log(data);

// using nps api: https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF searching by state initials

// var wildfireUrl = "https://api.ambeedata.com/latest/fire?lat=12.9889055&lng=77.574044"

var latitude;
var longitude;


var nationalParkUrl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=S3FQh2LolEVzZgRjcg7QskevKLZrUOfgYYhWZucF";

// $.ajax({
//     url: nationalParkUrl,
//     method: "GET"
// }).then(function (response){
//     console.log(response.data[32].latitude, response.data[32].longitude);
//     let latitude = response.data[32].latitude;
//     let longitude = response.data[32].longitude;
//     let parkName = response.data[32].fullName;
//     console.log(parkName);
// })

fetch(nationalParkUrl)
    .then(function(response) {
        return response.json();
    }).then(function(callData) {
        latitude = callData.data[32].latitude;
        longitude = callData.data[32].longitude;
        let parkName = callData.data[32].fullName;
        console.log(latitude, longitude, parkName);
        console.log(callData.data.length);
    });
