function initPage() {
  var cityElement = document.getElementById("city");
  var searchElement = document.getElementById("searchbtn");
  var clearElement = document.getElementById("clearbtn");
  var tempElement = document.getElementById("temp");
  var humidityElement = document.getElementById("humdity");
  var windElement = document.getElementById("wind");
  var UVElement = document.getElementById("uv-index");
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

        const todaysDate = dayjs();
        $("#cityname").text(todaysDate.format('MMM D, YYYY'));
        var currenticon = response.data.weather[0].icon;
        weathericon.setAttribute("src", "https://openweathermap.org/img/wn/" + currenticon + "@2x.png");
        tempElement.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
        //humidityElement.innerHTML = "Humidity: " + response.data.humidity + "%"; - not working
        windElement.innerHTML = "Wind speed: " + response.data.wind.speed + " MPH";

        var lon = response.data.coord.lon;
        var lat = response.data.coord.lat;
        var UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";
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
            FivedayFC(cityName);
          });
      })
    //5day forcast function - not appending
    function FivedayFC(response) {
      var cityID = response;
      var FCUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityID + "&appid=" + APIkey;
      axios.get(FCUrl)
        .then(function (response) {
          var fivedayelement = [];
          for (var i = 0; i < response.length; i++) {
            var hour = (response.list[i].dt_txt.split(" "))[1];
            if (hour === "16:00:00") {
              fivedayelement.push(response.list[i])
            }
          }
          for (var f = 0; f < fivedayelement.length; f++) {
            $("#day" + (f + 1)).empty();
            var newDoW = $("<div>");
            newDoW.text(moment(fivedayelement[f].dt_txt).format("dddd"));
            newDoW.attr("style", "font-weight: 600")
            var newdate = $("<div>");
            newdate.text((moment(fivedayelement[f].dt_txt).format("MM/DD/YYYY")));
            var newicon = $("<img>").attr("src", "https://openweather.org/img/wn/" + fivedayelement[f].weather[0].icon + "@2x.png")
            var newtemp = $("<div>");
            newtemp.text((fivedayelement[f].main.temp.toFixed()) + "°");
            var newhumidity = $("<div>");
            newhumidity.text(fivedayelement[f].main.humidity + "% Humdity")
            $("#day" + (f + 1)).append(newDoW, newdate, newicon, newtemp, newhumidity);
          }
        })
    }
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
    Getweather(cityName);

  })
  //convert to F
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