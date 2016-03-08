console.log(Backbone)

// ---------------- Change View ---------------- //
// changes hash depending on what button was clicked
var changeView = function(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		lat = routeParts[1],
		lng = routeParts[2]

	var buttonEl = clickEvent.target,
		newView = buttonEl.value
	location.hash = newView + "/" + lat + "/" + lng
}

// ---------------- Promise Statement ---------------- //
// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var makeWeatherPromise = function(lat,lng) {
	var url = baseUrl + "/" + apiKey + "/" + lat + "," + lng + "?callback=?"
	var promise = $.getJSON(url)
	return promise
}

// ---------------- Current ---------------- //

var generateCurrentHTML = function(response){
	console.log(response)
	var htmlString = "<div class='currentTempStyles'>"
		htmlString += 	"<h1>" + Math.round(response.currently.temperature) + "&deg; F</h1>"
		htmlString += 	"<p>" + response.currently.summary + "</p>"
		htmlString +=	"<canvas id='icon1' width='100' height='100'></canvas>"
		htmlString += "</div>"
	containerEl.innerHTML = htmlString
	var iconString = response.currently.icon
	doSkyconStuff(iconString)
}

// ---------------- Daily ---------------- //

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

// ---------------- Controller ---------------- //

var WeatherRouter = Backbone.Router.extend({ //THIS IS JUST A CONSTRUCTOR!
	routes: {
		"current/:lat/:lng": "handleCurrentView",
		"daily/:lat/:lng": "handleDailyView",
		"hourly/:lat/:lng": "handleHourlyView",
		"*default": "handleDefault"
	},

	handleCurrentView: function(lat,lng) {
		var promise = makeWeatherPromise(lat,lng)
		promise.then(generateCurrentHTML)
	},

	handleDailyView: function(lat,lng) {
		var promise = makeWeatherPromise(lat,lng)
		promise.then(generateDailyHTML)
	},

	handleDefault: function() {
		// get current lat long, write into the route
		var successCallback = function(positionObject) {
			var lat = positionObject.coords.latitude 
			var lng = positionObject.coords.longitude 
			location.hash = "current/" + lat + "/" + lng
		}
		var errorCallback = function(error) {
			console.log(error)
		}
		window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
	},

	handleHourlyView: function(lat,lng) {
		var promise = makeWeatherPromise(lat,lng)
		promise.then(generateHourlyHTML)	
	}
})

// ---------------- Skycons ---------------- //

var doSkyconStuff = function(iconString) {
	//console.log(iconString)
	var formattedIcon = iconString.toUpperCase().replace(/-/g,"_")

	var skycons = new Skycons({"color": "white"})

	// you can add a canvas by it's ID...
	skycons.add("icon1", Skycons[formattedIcon])

	skycons.play()
}

// ---------------- Listeners ---------------- //
var apiKey = "78a91726f6e91c6781a68df0242f1f54"
var baseUrl = "https://api.forecast.io/forecast"
// containers
var containerEl = document.querySelector("#currentTemp")

var buttonsContainer = document.querySelector(".buttons")
buttonsContainer.addEventListener('click',changeView)

var rtr = new WeatherRouter()
Backbone.history.start()
