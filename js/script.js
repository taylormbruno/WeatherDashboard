// Left side of screen: search bar with history of cities
// Display city, date, icon image (visual representation of weather conditions), temperature, humidity, wind speed, uv index.
// 5-day forecast under current display
// create multiple functions to handle the different parts of the dashboard
// * current conditions
// * 5-day forecast
// * search history - w/ local storage to
// * uv index
// will need more than one ajax call

//bonus add geolcation API (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to add current location to the initial landing page
//add to portfolio

var apiKey1 = "&APPID=7700422858fd24e6a305f7fce63ab514";
var apiKey2 = "&APPID=a0d41cd580f135c5d1113ad410375911";
var impUnit = "&units=imperial";
var queryUrl = "https://api.openweathermap.org/data/2.5/";

var city = $("#cityInput").val();
var cityHistory = [];
// cityHistory = localStorage.getItem("cityHistory");

var lon = 0;
var lat = 0;

// function citySearch() {

// search button click event & logs local storage
$(document).on("click", "#searchButton", function(){
    event.preventDefault();
    var storedHistory = JSON.parse(localStorage.getItem("cityHistory"));
    city = $("#cityInput").val();
    console.log(city);
    // console.log(storedHistory);
    cityHistory = storedHistory;
    cityHistory.push(city);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    cityForecast();
    createHistory();
});

currentLocation();
function currentLocation() {
    createHistory();
    navigator.geolocation.getCurrentPosition(function(position) {
        var userLat = position.coords.latitude;
        var userLon = position.coords.longitude;
        $.ajax({
            url: queryUrl + ("forecast?lat=" + userLat + "&lon=" + userLon) + impUnit + apiKey1,
            method: "GET"
        }).then(function(response) {
            // display date, icon, temp, humidity for 5 day forecast
            $("#fiveDayRow").empty();
    
            $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl' id='dayOneEl'><h5>" + moment().add(1, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[4].weather[0].icon + "@2x.png' title='" + response.list[4].weather[0].description + "'> <h6>Temp: " + response.list[4].main.temp + " °F</h6> <h6>Humidity: " + response.list[4].main.humidity + "%</h6></div>");
    
            $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(2, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[12].weather[0].icon + "@2x.png' title='" + response.list[12].weather[0].description + "'> <h6>Temp: " + response.list[12].main.temp + " °F</h6> <h6>Humidity: " + response.list[12].main.humidity + "%</h6></div>");
    
            $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(3, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[20].weather[0].icon + "@2x.png' title='" + response.list[20].weather[0].description + "'> <h6>Temp: " + response.list[20].main.temp + " °F</h6> <h6>Humidity: " + response.list[20].main.humidity + "%</h6></div>");
            
            $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(4, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[28].weather[0].icon + "@2x.png' title='" + response.list[28].weather[0].description + "'> <h6>Temp: " + response.list[28].main.temp + " °F</h6> <h6>Humidity: " + response.list[28].main.humidity + "%</h6></div>");
    
            $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(5, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[36].weather[0].icon + "@2x.png' title='" + response.list[36].weather[0].description + "'><h6>Temp: " + response.list[36].main.temp + " °F</h6> <h6>Humidity: " + response.list[36].main.humidity + "%</h6></div>");
        
            $.ajax({
                url: queryUrl + ("weather?lat=" + userLat + "&lon=" + userLon) + impUnit + apiKey1,
                method: "GET"
            }).then(function(response) {
                // display city, date, and icon
                $(".currentEl").empty();
                $(".currentEl").append("<h2>" + response.name + "  " + moment().format("M/D/YY") + "</h2><img src='https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png' title='" + response.weather[0].description + "'>");
        
                // display temperature
                $(".currentEl").append("<h4 class='currentLI'>Temperature: " + response.main.temp + "°F</h4>");
        
                // display humidity
                $(".currentEl").append("<h4 class='currentLI'>Humidity: " + response.main.humidity + "%</h4>");
                
                // display wind speed
                $(".currentEl").append("<h4 class='currentLI'>Wind Speed: " + response.wind.speed + " MPH</h4>");
                
                // display UV index w/ color
                $.ajax({
                    url: queryUrl + ("uvi?lat=" + userLat + "&lon=" + userLon) + apiKey1,
                    method: "GET"
                }).then(function(response) {
                    $(".currentEl").append("<h4 class='currentLI'>UV Index: <span id='uvValue'>" + response.value + "</span></h4>")
                    var uvRating = document.getElementById("uvValue");
                    if (response.value < 3) {
                        uvRating.style.backgroundColor = "#00f900";
                    }
                    else if (response.value < 6) {
                        uvRating.style.backgroundColor = "#f5f900";
                    }
                    else if (response.value < 8) {
                        uvRating.style.backgroundColor = "#f97300";
                    }
                    else if (response.value < 11) {
                        uvRating.style.backgroundColor = "#f53b3b";
                    }
                    else {
                        uvRating.style.backgroundColor = "#a758fd";
                    }
                });
            });
        });
    });
}


function createHistory() {
    var storedHistory = JSON.parse(localStorage.getItem("cityHistory"));
    cityHistory = storedHistory;
    if (cityHistory !== null) {
        $(".historySect").empty();
        for (i = 1; i < 6; i++){
            $(".historySect").append("<button class='btn btn-secondary historyBtn' value='" + cityHistory[cityHistory.length - i] + "'>" + cityHistory[cityHistory.length - i] + "</button><br />"); 
            if (cityHistory[cityHistory.length - i - 1] == null) {
                break;
            }
        }   
    }
}

function cityForecast() {
    var city = $("#cityInput").val();
    $.ajax({
        url: queryUrl + ("forecast?q=" + city) + impUnit + apiKey1,
        method: "GET"
    }).then(function(response) {
        // display date, icon, temp, humidity
        $("#fiveDayRow").empty();
        $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl' id='dayOneEl'><h5>" + moment().add(1, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[4].weather[0].icon + "@2x.png' title='" + response.list[4].weather[0].description + "'> <h6>Temp: " + response.list[4].main.temp + " °F</h6> <h6>Humidity: " + response.list[4].main.humidity + "%</h6></div>");

        $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(2, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[12].weather[0].icon + "@2x.png' title='" + response.list[12].weather[0].description + "'> <h6>Temp: " + response.list[12].main.temp + " °F</h6> <h6>Humidity: " + response.list[12].main.humidity + "%</h6></div>");

        $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(3, "d").format("M/D/YY") + "</h5> <img src='http://openweathermap.org/img/wn/" + response.list[20].weather[0].icon + "@2x.png' title='" + response.list[20].weather[0].description + "'> <h6>Temp: " + response.list[20].main.temp + " °F</h6> <h6>Humidity: " + response.list[20].main.humidity + "%</h6></div>");
        
        $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(4, "d").format("M/D/YY") + "</h5> <img src='http://openweathermap.org/img/wn/" + response.list[28].weather[0].icon + "@2x.png' title='" + response.list[28].weather[0].description + "'> <h6>Temp: " + response.list[28].main.temp + " °F</h6> <h6>Humidity: " + response.list[28].main.humidity + "%</h6></div>");

        $("#fiveDayRow").append("<div class='card bg-primary text-white fiveDayEl'><h5>" + moment().add(5, "d").format("M/D/YY") + "</h5> <img src='https://openweathermap.org/img/wn/" + response.list[36].weather[0].icon + "@2x.png' title='" + response.list[36].weather[0].description + "'><h6>Temp: " + response.list[36].main.temp + " °F</h6> <h6>Humidity: " + response.list[36].main.humidity + "%</h6></div>");

        $.ajax({
            url: queryUrl + ("weather?q=" + city) + impUnit + apiKey1,
            method: "GET"
        }).then(function(response) {
            // display city name date and icon in h2
            $(".currentEl").empty();
            $(".currentEl").append("<h2>" + response.name + "  " + moment().format("M/D/YY") + "</h2><img src='https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png' title='" + response.weather[0].description + "'>");
    
            // display temperature
            $(".currentEl").append("<h4 class='currentLI'>Temperature: " + response.main.temp + "°F</h4>");
    
            // display humidity
            $(".currentEl").append("<h4 class='currentLI'>Humidity: " + response.main.humidity + "%</h4>");
            
            // display wind speed
            $(".currentEl").append("<h4 class='currentLI'>Wind Speed: " + response.wind.speed + " MPH</h4>");
            
            // display UV index w/ color
            lon = response.coord.lon;
            lat = response.coord.lat;

            $.ajax({
                url: queryUrl + ("uvi?lat=" + lat + "&lon=" + lon) + apiKey1,
                method: "GET"
            }).then(function(response) {
                $(".currentEl").append("<h4 class='currentLI'>UV Index: <span id='uvValue'>" + response.value + "</span></h4>")
                var uvRating = document.getElementById("uvValue");
                if (response.value < 3) {
                    uvRating.style.backgroundColor = "#00f900";
                }
                else if (response.value < 6) {
                    uvRating.style.backgroundColor = "#f5f900";
                }
                else if (response.value < 8) {
                    uvRating.style.backgroundColor = "#f97300";
                }
                else if (response.value < 11) {
                    uvRating.style.backgroundColor = "#f53b3b";
                }
                else {
                    uvRating.style.backgroundColor = "#a758fd";
                }
            });
        });
    }); 
}

$(document).on("click", ".historyBtn", function(event) { 
    event.preventDefault();
    $("#cityInput").val($(this).val());
    cityForecast();
});


