// ---------------- Global Variables ---------------- //

// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var apiKey = "78a91726f6e91c6781a68df0242f1f54"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey
// containers
var containerEl = document.querySelector("#currentTemp"),
	currentViewButton = document.querySelector("#buttons button[value='current']"),
	dailyViewButton = document.querySelector("#buttons button[value='daily']"),
	hourlyViewButton = document.querySelector("#buttons button[value='hourly']")