// ---------------- Global Variables ---------------- //

// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var apiKey = "78a91726f6e91c6781a68df0242f1f54"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey
// containers
var containerEl = document.querySelector("#currentTemp"),
	currentViewButton = document.querySelector("#buttons button[value='current']"),
	dailyViewButton = document.querySelector("#buttons button[value='daily']"),
	hourlyViewButton = document.querySelector("#buttons button[value='hourly']")


// ---------------- Controller ---------------- //

var controller = function () {
	// var route = window.location.hash.substring(1)
	var viewType = window.location.hash.substring(1)
	// TO DO: split "<view type>/<search word>" into an array later when search function is added
	if (viewType === "current") {
		successCallback(currentQuery)
	}
	else if (viewType === "daily") {
		dailyCallback(currentQuery)
	}
	else if (viewType === "hourly") {
		hourlyCallback(currentQuery)
	}
}

// ---------------- Change View ---------------- //
// changes hash depending on what button was clicked
var viewChange = function(event) {
	var buttonEl = event.target,
		currentQuery = location.hash.split('/')[1]
	location.hash = buttonEl.value + '/' + currentQuery
}


// current temp from geolocation, latitude and longitude
var successCallback = function(positionObj) {
// console.log(positionObj)
	var lat = positionObj.coords.latitude,
		long = positionObj.coords.longitude

	var fullUrl = baseUrl + "/" + lat + "," + long + "?callback=?"
	$.getJSON(fullUrl).then(generateHtml)
}



var generateHtml = function(response){
	console.log(response)
	var htmlString = "<div class='currentTempStyles'>"
		htmlString += 	"<h1>" + response.currently.temperature + "&deg; F</h1>"
		htmlString +=	"<p>" + response.currently.icon + "</p>"
		htmlString += "</div>"
	containerEl.innerHTML = htmlString
}

// ---------------- Listeners ---------------- //

navigator.geolocation.getCurrentPosition(successCallback)
window.addEventListener('hashchange', controller)
currentViewButton.addEventListener('click', viewChange)
dailyViewButton.addEventListener('click', viewChange)
hourlyViewButton.addEventListener('click', viewChange)

controller()