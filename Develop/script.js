
//openWeather APIKey
//my apiKey = c4a186ac3a697bd2fb942f498b34386c

//need to add longitude and latitude variables into url when ready
var openWeatherUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=37.84883288&lon=-119.5571873&units=imperial&exclude={minutely,alerts,hourly}&appid=c4a186ac3a697bd2fb942f498b34386c"; 



//openWeather OneCall data(temp, humidity, wind speed, wind gusts, precipitation) 
function openWeatherCall() {
    fetch(openWeatherUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        let temp = data.current.temp;
        let humidity = data.current.humidity;
        let windSpeed = data.current.wind_speed;
        let windGust = data.current.wind_gust;
        //only found precip on the minutely status
        let precip = data.minutely[0].precipitation;

        //append data to designated html element here
        
        console.log(temp,humidity,windSpeed,windGust,precip);
    });
};
openWeatherCall();



