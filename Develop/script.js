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