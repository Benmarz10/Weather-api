function init() {
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
  var history = JSON.parse(localStorage.getItem("search")) || [];


  //DEFINE API KEY
  var APIkey = "936f1dd87a366f76756f425c7faa8541";

  //function for todays weather
  function weather(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    fetch(queryUrl)
      .then(function (response) {
        var todaysDate = new Date(response.formData.dt * 1000);
        var day = todaysDate.getDate();
        var month = todaysDate.getMonth();
        var year = todaysDate.getFullYear();
        nameElement.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ")";

        var lon = response.data.coord.lon
        var lat = response.data.coord.lat
        var UVqueryURL = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";
        fetch(UVqueryURL)
          .then(function(response){
            var UVindex = document.createElement("span")

            if (response.data[0].value < 4 ) {
              UVindex.setAttribute("class", "badge badge-success");
          }
          else if (response.data[0].value < 8) {
              UVindex.setAttribute("class", "badge badge-warning");
          }
          else {
              UVindex.setAttribute("class", "badge badge-danger");
          }
          console.log(response.data[0].value)
          UV.innerHTML = response.data[0].value;
          UVElement.innerHTML = "UV Index: ";
          UVElement.append(UVindex);
          });

          var cityname = response.data.id;
          var fivedayqueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityname + "&appid=" + APIkey;
          fetch(fivedayqueryURL)
            .then(function(response) {
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
              }
            })


      })
  }

  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key} - UV-index
}