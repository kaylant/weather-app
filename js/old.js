// ---------------- Global Variables ---------------- //

// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var apiKey = "78a91726f6e91c6781a68df0242f1f54"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey
// containers
var containerEl = document.querySelector("#currentTemp"),
	currentViewButton = document.querySelector(".buttons button[value='current']"),
	dailyViewButton = document.querySelector(".buttons button[value='daily']"),
	hourlyViewButton = document.querySelector(".buttons button[value='hourly']")

// ---------------- Current ---------------- //
var getCurrentWeather = function(positionObj) {
	var lat = positionObj.coords.latitude,
		long = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + long
	// var fullUrl = baseUrl + "/" + lat + "," + long + "?callback=?"
	$.getJSON(fullUrl + "?callback=?").then(generateCurrentHTML)
}

var generateCurrentHTML = function(response){
	// console.log(response)
	var htmlString = "<div class='currentTempStyles'>"
		htmlString += 	"<h1>" + Math.round(response.currently.temperature) + "&deg; F</h1>"
		// htmlString +=	"<canvas id='icon2' width='128' height='128'>" + skycons.add(response.currently.icon) + "</canvas>"
		htmlString += "</div>"
	containerEl.innerHTML = htmlString
}

// ---------------- Daily ---------------- //

var getDailyWeather = function(positionObj) {
	var lat = positionObj.coords.latitude,
		long = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + long
	// var fullUrl = baseUrl + "/" + lat + "," + long + "?callback=?"
	$.getJSON(fullUrl + "?callback=?").then(generateDailyHTML)
}

var generateDailyHTML = function(jsonData) { 
	// console.log(jsonData)
	var daysArray = jsonData.daily.data
	// console.log(daysArray)
	var totalHtmlString = ''
	for(var i = 0; i < daysArray.length; i++){
	    var soloDay = daysArray[i]
	    // console.log(soloDay) 
		totalHtmlString += generateDayHTML(soloDay) 
	}
	containerEl.innerHTML = totalHtmlString
} 

var generateDayHTML = function(response){
	// console.log(response)
	var timeValue = response.time
    var nowDate = new Date(timeValue * 1000)
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    var day = days[nowDate.getDay()]
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov"]
    var month = months[nowDate.getMonth()]
    var date = nowDate.getDate()
   	var dateString = day + ", " + month + " " + date
	var htmlString = "<div class='dailyTempStyles'>"
		htmlString += 	"<p>" + dateString + "</p>"
		htmlString += 	"<p>High " + Math.round(response.apparentTemperatureMax) + "&deg; F</p>"
		htmlString += 	"<p>Low " + Math.round(response.apparentTemperatureMin) + "&deg; F</p>"
		htmlString += 	"<p>" + response.summary + "</p>"
		htmlString += "</div>"
	return htmlString
}

// ---------------- Hourly ---------------- //

var getHourlyWeather = function(positionObj) {
	var lat = positionObj.coords.latitude,
		long = positionObj.coords.longitude
	var fullUrl = baseUrl + "/" + lat + "," + long
	// var fullUrl = baseUrl + "/" + lat + "," + long + "?callback=?"
	$.getJSON(fullUrl + "?callback=?").then(generateHourlyHTML)
}

var generateHourlyHTML = function(jsonData) { 
	// console.log(jsonData)
	var hourlyArray = jsonData.hourly.data
	// console.log(daysArray)
	var totalHtmlString = ''
	for(var i = 0; i < 24; i++){
	    var soloHour = hourlyArray[i]
	    // console.log(soloDay) 
		totalHtmlString += generateHourHTML(soloHour) 
	}
	containerEl.innerHTML = totalHtmlString
} 

var generateHourHTML = function(response){
	console.log(response)
	var time = response.time
        time = time * 1000
    var d = new Date(time)
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours()
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes()
    var formattedTime = hours + ":" + minutes
	var htmlString = "<div class='hourlyTempStyles'>"
		htmlString += 	"<p>" + formattedTime + " hrs</p>"
		htmlString += 	"<p>" + Math.round(response.apparentTemperature) + "&deg; F</p>"
		htmlString += "</div>"
	return htmlString
}

// ---------------- Change View ---------------- //
// changes hash depending on what button was clicked
var viewChange = function(event) {
	var buttonEl = event.target
	// currentQuery = window.location.hash.split('/')[1]
	window.location.hash = buttonEl.value
	// later: add search query to end of url: 
	// window.location.hash = buttonEl.value + '/' + currentQuery
}

// ---------------- Controller ---------------- //

var controller = function() {
	// var route = window.location.hash.substring(1)
	var viewType = window.location.hash.substring(1)
	// TO DO: split "<view type>/<search word>" into an array later when search function is added
	if (viewType === "current") {
		navigator.geolocation.getCurrentPosition(getCurrentWeather)	
	}
	else if (viewType === "daily") {
		navigator.geolocation.getCurrentPosition(getDailyWeather)
	}
	else if (viewType === "hourly") {
		navigator.geolocation.getCurrentPosition(getHourlyWeather)
	}
}

// ---------------- Listeners ---------------- //

if (window.location.hash === '') window.location.hash = "current"
else controller()
// controller()
window.addEventListener('hashchange', controller)
currentViewButton.addEventListener('click', viewChange)
dailyViewButton.addEventListener('click', viewChange)
hourlyViewButton.addEventListener('click', viewChange)
