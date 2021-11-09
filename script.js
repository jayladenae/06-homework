var myKey = '94e710356aa7af86e3b5d3a5756a33c3';
var cityName = "";
var response;
var part = "minutely,hourly";

var latitude;
var longitude;

var oneCallApi;
var fiveDayApi;

// get main elements by id
var mainDiv = document.getElementById("main")
var userInput = document.getElementById("userSearch");
var submitBtn = document.getElementById("searchBtn");

//get ul into variable savedSearches
var savedSearches = document.getElementById("saved-searches");


var storageList = [];

var userLocalStorage = JSON.parse(localStorage.getItem('userLocalStorage'));
console.log(userLocalStorage);

if (userLocalStorage !== null) {
  for (var item of userLocalStorage) {
      storageList.push(item);
      var newListItem = document.createElement('li');
      newListItem.setAttribute("class", "btn btn-primary mt-2");
      newListItem.textContent = item;
      newListItem.addEventListener("click", function(event) {
        mainDiv.innerHTML = "";
        cityName = event.target.textContent;
        getCoordinates(cityName);
        
      });
      console.log(newListItem);
      
      savedSearches.appendChild(newListItem);
      console.log(savedSearches);
  }
}

// submit Button
submitBtn.addEventListener("click", function(event){
  event.preventDefault();
  cityName = "";
  mainDiv.innerHTML = "";
  response = userInput.value;
  cityName = response;
  getCoordinates(cityName);

  var newListItem = document.createElement('li');
  newListItem.setAttribute("class", "btn btn-primary");
  newListItem.textContent = cityName;
  newListItem.addEventListener("click", function(event) {
    mainDiv.innerHTML = "";
    cityName = event.target.textContent;
    getCoordinates(cityName)
  })

  savedSearches.appendChild(newListItem);
  //if there is a result push newListItem value onto the storage list array
  storageList.push(newListItem.textContent);
  localStorage.setItem('userLocalStorage', JSON.stringify(storageList));
});




function getCoordinates(cityName) {
  // assign API url to five day api variable
  fiveDayApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myKey}`

  // fetch the api url
  fetch(fiveDayApi) 
    // then run function with response
    .then(function (response) {
        if (response.ok) {
          // convert response to json
          response.json() .then( function(data) {
            console.log(data.coord.lat);
            console.log(data.coord.lon);

            latitude = data.coord.lat
            longitude = data.coord.lon

            getOneCallApi(latitude,longitude);
          })
        }
    })
}



function getOneCallApi (latitude, longitude) {
  oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${myKey}`
  fetch(oneCallApi) 
    // then run function with response
    .then(function (response) {
        if (response.ok) {
          // convert response to json
          response.json() .then( function(data) {
            console.log(data);
            // get humidity
            console.log(data.current.humidity);
            var currentHumidity = data.current.humidity
            // get temperature
            console.log(data.current.temp);
            var currentTemperature = Math.round((data.current.temp-273.15)*(9/5) + 32);
            console.log(currentTemperature);
            // get uv index
            console.log(data.current.uvi);
            var currentUvi = data.current.uvi
            // get date and time
            console.log(data.current.dt);
            var currentDateTime = new Date (data.current.dt*1000)
            currentDateTime = currentDateTime.toLocaleDateString("en-US")
            console.log(currentDateTime)
            // get wind direction and speed
            console.log(data.current.wind_deg);
            console.log(data.current.wind_speed);
            var currentWindDirection = data.current.wind_deg
            var currentWindSpeed = data.current.wind_speed
            // get the current weather status
            console.log(data.current.weather[0].description);
            var currentWeatherStatus = data.current.weather[0].description
            // get the icon
            var currentIcon = data.current.weather[0].icon;
            console.log(currentIcon);


            // source for icon url
            var currentIconUrl = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`

            // creating card dynamically
            var currentWeatherResults = document.createElement('div');
            // give the div for the current weather classes
            currentWeatherResults.setAttribute("class", "container d-flex justify-content-center");
            
            currentWeatherResults.innerHTML = `
            <div class="card mb-3 ml-5" style=" min-width: 50rem">
              <h5 class="card-title">${cityName}</h5> 
              <div> <img src="${currentIconUrl}" alt ="weather icon"></div>
              <div class="card-body">
                <p class="card-text">${currentDateTime}</p>
                <p class="card-text">${currentWeatherStatus}</p>
                <p class="card-text">${currentTemperature} \xB0F</p>
                <p class="card-text">UVI: ${currentUvi}</p>
                <p class="card-text">${currentHumidity} %</p>
                <p class="card-text">${currentWindSpeed} mph</p>
             </div>
            </div>`

            mainDiv.appendChild(currentWeatherResults);

            
            var dailyWeatherResults = document.createElement('div');
             dailyWeatherResults.setAttribute("class", "container d-flex justify-content-center flex wrap")
             mainDiv.appendChild(dailyWeatherResults);
            

          

            for(var i = 1; i <= 5; i++) {
              console.log(data.daily[1]);
              // get humidity
              console.log(data.daily[i].humidity);
              var dailyHumidity = data.daily[i].humidity;
              // get day time temperature
              console.log(data.daily[i].temp.day);
              var dailyTemperature = Math.round((data.daily[i].temp.day-273.15)*(9/5) + 32);
              // get date time
              console.log(data.daily[i].dt);
              var dailyDateTime = new Date(data.daily[i].dt*1000);
              dailyDateTime = dailyDateTime.toLocaleDateString("en-US")
              console.log(dailyDateTime);
              // daily weather status
              console.log(data.daily[i].weather[0].description);
              var dailyWeatherStatus = data.daily[i].weather[0].description;
              // get the icon
              console.log(data.daily[i].weather[0].icon);
              var dailyIcon = data.daily[i].weather[0].icon;
              // get wind speed
              console.log(data.daily[i].wind_speed);
              console.log(data.daily[i].wind_deg);
              var dailyWindSpeed = data.daily[i].wind_speed;
              var dailyWindDirection = data.daily[i].wind_deg;
              // get uvi
              var dailyUvi = data.daily[i].uvi
              console.log(data.daily[i].uvi);



              var dailyIconUrl = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`
            console.log(dailyIcon);


               // creating card dynamically
             

             var dailyWeatherDiv = document.createElement('div');
             

             dailyWeatherDiv.innerHTML = `
             <div class="card mb-3 m-3" style="max-width: 12rem; min-width: 12rem;"> 
             <div class="card-header bg transparent ">${dailyDateTime}</div>
               <div> <img src="${dailyIconUrl}" alt ="weather icon"></div>
               <div class="card-body">
                 <p class="card-text">${dailyDateTime}</p>
                 <p class="card-text">${dailyWeatherStatus}</p>
                 <p class="card-text">${dailyTemperature} \xB0F</p>
                 <p class="card-text">UVI: ${dailyUvi}</p>
                 <p class="card-text">${dailyHumidity} %</p>
                 <p class="card-text">${dailyWindSpeed} mph</p>
              </div>
             </div>`
 
             
             dailyWeatherResults.appendChild(dailyWeatherDiv);
            
            }
          })
        }
    })
}
