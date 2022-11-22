// global variables/arrays
var cityHistory = []
fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + "Denver" + '&appid=6a16f44aa0339e512c7d8ee4624fb62c')
        .then(res => {
            console.log(res.body)
            return res.json()
        })
        .then(data => {
            console.log(data)
            injectCurrentDay(data)
            injectData(data)
        })





$("#search-Btn").on("click", citySearch)
// when user searches for a city = clicks search button
function citySearch(e) {
    e.preventDefault()
    //  1. store the user input in a variable
    var userInput = $("#search").val()
    if (!cityHistory.includes(userInput)) {
        //  2. store city into local storage
        cityHistory.push(userInput)
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory))
        loadHistory()
    }
    //  3. use fetch api to get the current & next 5 day weather for that city
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + userInput + '&appid=6a16f44aa0339e512c7d8ee4624fb62c')
        .then(res => {
            console.log(res.body)
            return res.json()
        })
        .then(data => {
            console.log(data)
            injectCurrentDay(data)
            injectData(data)
        })
}



// use the data from fetch to inject in the current day weather box :
function injectCurrentDay(data) {
    var i = 1
    //  1. name of place and today's date MM/DD/YYYY and  weather icon
    $("#city-date").text(data.city.name + " " + dayjs.unix(data.list[i].dt).format("M/D/YYYY"))
    $("#icon").attr('src','http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png')
    console.log(data.city.name, dayjs.unix(data.list[i].dt).format("M/D/YYYY"), data.list[i].weather[0].icon)
    //  2. temperature Fahrenheit 
    $("#temp").text(Math.floor((data.list[i].main.temp - 273.15) * 9 / 5 + 32) + " " + "F")
    console.log(Math.floor((data.list[i].main.temp - 273.15) * 9 / 5 + 32))
    //  3. wind MPH
    $("#wind").text(Math.floor(data.list[i].wind.speed * 2.237) + " " + "MPH")
    console.log(Math.floor(data.list[i].wind.speed * 2.237))
    //  4. humidity %
    $("#humid").text(data.list[i].main.humidity + "%")
    console.log(data.list[i].main.humidity)
}



// use the data from fetch to inject in the five-day boxes:
function injectData(data) {
    $("#forecast").children().remove()
    //  1. date M/DD/YYY
    for (var i = 7; i < 40; i += 8) {
        var day = $("<div>").addClass("flex flex-col bg-white rounded mx-2 p-4 w-full max-w-xs")
        var date = $("<div>").addClass("font-bold text-xl")
        date.text(dayjs.unix(data.list[i].dt).format("M/D/YYYY"))
        var temp_header = $("<div>").addClass("font-medium text-sm").text("Temperature")
        var temp_data = $("<div>").addClass("flex flex-row items-center justify-center mt-6")
        var temperature = $("<div>").addClass("font-medium text-6xl")
        temperature.text(Math.floor((data.list[i].main.temp - 273.15) * 9 / 5 + 32) + " " + "F")
        var icon = $("<img>").attr('src', 'http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '@2x.png')
            .addClass("flex flex-col items-center ml-6")
            .append($("<div>").text(data.list[i].weather[0].icon))
        temp_data.append(temperature).append(icon)

        var wind_humidity = $("<div>").addClass("flex flex-row justify-between mt-6")
        var wind_data = $("<div>").addClass("flex flex-col items-center")
        var wind_header = $("<div>").addClass("font-medium text-sm").text("Wind")
        var wind = $("<div>")
            .addClass("text-sm text-gray-500")
            .text(Math.floor(data.list[i].wind.speed * 2.237) + " " + "MPH")
        wind_data.append(wind_header).append(wind)
        var humidity_data = $("<div>").addClass("flex flex-col items-center")
        var humidity_header = $("<div>").addClass("font-medium text-sm").text("Humidity")
        var humidity = $("<div>")
            .addClass("text-sm text-gray-500")
            .text(data.list[i].main.humidity + "%")
        humidity_data.append(humidity_header).append(humidity)
        wind_humidity.append(wind_data).append(humidity_data)

        day.append(date).append(temp_header).append(temp_data).append(wind_humidity)
        $("#forecast").append(day)
    }
}

// use data in local.storage to create a button under the search area for city history
//  1. use target so that when you click any one of the buttons, a function runs lnes 16-29
//$(".searchBtn").on("click", saveLocal)

function loadHistory(e) {
    //for each city cin the array of cities create a div and set its .string
    $("#buttons").children().remove()
    var data = localStorage.getItem("cityHistory")
    if (data) {
        cityHistory = JSON.parse(data)
        for (var i = 0; i < cityHistory.length; i++) {
            var button = $("<button>").text(cityHistory[i])
            button.addClass("bg-slate-400 rounded m-2 p-2")
            $("#buttons").append(button)
        }
    }

}

loadHistory()

$("#buttons").on('click', citySearchButtons)

function citySearchButtons(e) {
    var userInput = $(e.target).text()
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + userInput + '&appid=6a16f44aa0339e512c7d8ee4624fb62c')
        .then(res => {
            console.log(res.body)
            return res.json()
        })
        .then(data => {
            console.log(data)
            injectCurrentDay(data)
            injectData(data)
        })
}
