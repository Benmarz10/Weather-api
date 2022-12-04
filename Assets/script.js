var cityElement = document.getElementById("city");
var searchElement = document.getElementById("searchbtn");
var clearElement = document.getElementById("clearbtn");
var nameElement = document.getElementById("city-name");
var tempElement = document.getElementById("temp");
var humidityElement = document.getElementById("humdity");
var windElement = document.getElementById("wind");
var UVElement = document.getElementById("uv-index");
var forecastElement = document.getElementById("fiveday-forecast");
var todayElement = document.getElementById("today");


//DEFINE API KEY
var APIkey = "936f1dd87a366f76756f425c7faa8541";

//function for todays weather

//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}