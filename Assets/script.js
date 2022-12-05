function initPage() {
  var cityElement = document.getElementById("city");
  var searchElement = document.getElementById("searchbtn");
  var clearElement = document.getElementById("clearbtn");
  const nameElement = document.getElementById("cityname");
  var tempElement = document.getElementById("temp");
  var humidityElement = document.getElementById("humdity");
  var windElement = document.getElementById("wind");
  var UVElement = document.getElementById("uv-index");
  var forecastElement = document.getElementById("fiveday-forecast");
  var weathericon = document.getElementById("weather-icon")
  var historyElement = document.getElementById("history");
  var history = JSON.parse(localStorage.getItem("search")) || [];


  //DEFINE API KEY
  var APIkey = "936f1dd87a366f76756f425c7faa8541";

  //function for todays weather
  function Getweather(cityName) {
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
    axios.get(queryUrl)
      .then(function (response) {

        const todaysDate = new Date(response.dt * 1000);
        const day = todaysDate.getDate();
        const month = todaysDate.getMonth() + 1;
        const year = todaysDate.getFullYear();
        nameElement.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
        var currenticon = response.data.weather[0].icon;
        weathericon.setAttribute("src", "https://openweathermap.org/img/wn/" + currenticon + "@2x.png");
        tempElement.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
        //humidityElement.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        windElement.innerHTML = "Wind speed: " + response.data.wind.speed + " MPH";

        var lon = response.data.coord.lon;
        var lat = response.data.coord.lat;
        var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";
        axios.get(UVqueryURL)
          .then(function (response) {
            var UVindex = document.createElement("span");
        
            if (response.data[0].value < 4) {
              UVindex.setAttribute("class", "has-background-success");
            }
            else if (response.data[0].value < 8) {
              UVindex.setAttribute("class", "has-background-warning");
            }
            else {
              UVindex.setAttribute("class", "has-background-danger");
            }
            console.log(response.data[0].value)
            UVindex.innerHTML = response.data[0].value;
            UVElement.innerHTML = "UV Index: ";
            UVElement.append(UVindex);
          });
        //5day forcast function
        var cityname = response.data.id;
        var fivedayqueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityname + "&appid=" + APIkey;
        axios.get(fivedayqueryURL)
          .then(function (response) {
            forecastElement.classList.remove("is-hidden");
            var fivedayelement = document.querySelectorAll(".forecast");
            for (i = 0; i < fivedayelement.length; i++) {
              fivedayelement[i].innerHTML = "";
              var fcindex = i * 8 + 4;
              var fcdate = new Date(response.data.list[fcindex].dt * 1000);
              var fcday = fcdate.getDate();
              var fcmonth = fcdate.getMonth();
              var fcyear = fcdate.getFullYear();
              var fcdatele = document.createElement("p");
              fcdatele.setAttribute("class", "mt-3 mb-0 fc-date");
              fcdatele.innerHTML = fcmonth + "/" + fcday + "/" + fcyear;
              fcdatele[i].append(fcdatele);
              //add icon functions
              var fcweatherele = document.createElement("img");
              fcweatherele.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[fcindex].weather[0].icon + "@2x.png");
              fcweatherele.setAttribute("alt", response.data.list[fcindex].weather[0].description);
              fivedayelement[i].append(fcweatherele);
              var fctemp = document.createElement("p");
              fctemp.innerHTML = "Temp: " + k2f(response.data.list[fcindex].main.temp) + " &#176F";
              fivedayelement[i].append(fctemp);
              var fchumidity = document.createElement("p");
              fchumidity.innerHTML = "Humidity: " + response.data.list[fcindex].main.humidity + "%";
              fivedayelement[i].append(fchumidity);
              console.log("fuck me", fivedayqueryURL)
            }
          })
      })
  }
  //local storage functions
  searchElement.addEventListener("click", function () {
    var clickedsearch = cityElement.value;
    Getweather(clickedsearch);
    history.push(clickedsearch);
    localStorage.setItem("search", JSON.stringify(history));
    renderhistory();
  })
  //clearhistory functions
  clearElement.addEventListener("click", function () {
    localStorage.clear();
    history = [];
    renderhistory();
  })

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderhistory() {
    historyElement.innerHTML = "";
    for (let i = 0; i < history.length; i++) {
      var searchis = document.createElement("input");
      searchis.setAttribute("type", "text");
      searchis.setAttribute("readonly", true);
      searchis.setAttribute("class", "form-control d-block bg-white");
      searchis.setAttribute("value", history[i]);
      searchis.addEventListener("click", function () {
        Getweather(searchis.value);
      })
      historyElement.append(searchis);
    }
  }

  renderhistory();
  if (history.length > 0) {
    Getweather(history[history.length - 1]);
  }
}
initPage();