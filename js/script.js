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

// ---------------- Weather Model ---------------- //
// desired Url format: https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
var WeatherModel = Backbone.Model.extend ({
	_generateURL: function(lat,lng) {
		this.url = "https://api.forecast.io/forecast/78a91726f6e91c6781a68df0242f1f54/" + lat + "," + lng + "?callback=?"
	}
})

// ---------------- Current ---------------- //
var CurrentView = Backbone.View.extend ({
	el: "#currentTemp",

	initialize: function(inputModel){
		this.model = inputModel
		var boundRender = this._render.bind(this)
		this.model.on("sync", boundRender)
	},

	_render: function(){
		var htmlString = "<div class='currentTempStyles'>"
		    htmlString += 	"<h1>" + Math.round(this.model.attributes.currently.temperature) + "&deg; F</h1>"
			htmlString += 	"<p>" + this.model.attributes.currently.summary + "</p>"
			htmlString +=	"<canvas id='icon1' width='100' height='100'></canvas>"
			htmlString += "</div>"
		this.el.innerHTML = htmlString
		var iconString = this.model.attributes.currently.icon
		doSkyconStuff(iconString)
	}
})

// ---------------- Daily ---------------- //

var DailyView = Backbone.View.extend ({
	el: "#currentTemp",

	initialize: function(inputModel){
		this.model = inputModel
		var boundRender = this._render.bind(this)
		this.model.on("sync", boundRender)
	},

	_generateDayHTML: function(response){
		console.log(response)
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
	},

	_render: function(){
		var daysArray = this.model.attributes.daily.data
		var totalHtmlString = ''
		for(var i = 0; i < daysArray.length; i++){
		    var soloDay = daysArray[i]
		    totalHtmlString += this._generateDayHTML(soloDay)
		}

		this.el.innerHTML = totalHtmlString
	}
})



// ---------------- Hourly ---------------- //

var HourlyView = Backbone.View.extend ({
	el: "#currentTemp",

	initialize: function(inputModel){
		this.model = inputModel
		var boundRender = this._render.bind(this)
		this.model.on("sync", boundRender)
	},

	_generateHourHTML: function(response){
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
	},

	_render: function(){
		var hourlyArray = this.model.attributes.hourly.data
		var totalHtmlString = ''
		for(var i = 0; i < 24; i++){
		    var soloHour = hourlyArray[i]
			totalHtmlString += this._generateHourHTML(soloHour) 
		}
		this.el.innerHTML = totalHtmlString
	}
})

// ---------------- Controller ---------------- //

var WeatherRouter = Backbone.Router.extend({ 
	routes: {
		"current/:lat/:lng": "handleCurrentView",
		"daily/:lat/:lng": "handleDailyView",
		"hourly/:lat/:lng": "handleHourlyView",
		"*default": "handleDefault"
	},

	handleCurrentView: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateURL(lat,lng)
		var cv = new CurrentView(wm)
		wm.fetch()
	},

	handleDailyView: function(lat,lng) {
		console.log('handling daily route')
		var wm = new WeatherModel()
		wm._generateURL(lat,lng)
		var dv = new DailyView(wm)
		wm.fetch()
	},

	handleHourlyView: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateURL(lat,lng)
		var hv = new HourlyView(wm)
		wm.fetch()
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

	initialize: function() {
		Backbone.history.start()
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

// ---------------- Buttons ---------------- //

var buttonsContainer = document.querySelector(".buttons")
buttonsContainer.addEventListener('click',changeView)

// ---------------- Go! ---------------- //

var rtr = new WeatherRouter()

