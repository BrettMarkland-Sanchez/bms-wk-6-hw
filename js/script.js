let searchHistory = $('#history');
const APIKey = 'a907d16219204ccff8dfbfc9285d5e56';
let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let oneCallURL = 'https://api.openweathermap.org/data/2.5/onecall?';
let citySearch = $('#citySearch');
let search = $('#search');
let city;
let cityName = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let hum = $('#hum');
let UV = $('#UV');
let date = moment().format('L');

// Powers the whole page, based on search button click
search.click(function(){
  city = citySearch.val();
  getAPI();
});

// Similar to above, based on city button click
$(document).on('click','.city',function(){
  city = spacify($(this).attr('id'));
  getAPI();
});

// Replaces spaces with underscores 
// Used for cleaning up city names for use as IDs
function underscorify(city){
  let cityKey = city.replace(/ /g,"_");
  return cityKey;
}

// Replaces underscores with spaces in relevant strings
// Can use IDs with underscores as query data or labels with spaces
function spacify(cityKey){
  let city = cityKey.replace(/_/g," ");
  return city;
}

// Uses the OpenWeatherAPI city query to return and save city data with error handling
function getAPI(){
  fetch(queryURL+`${city}&units=imperial&appid=${APIKey}`)
    .then(function(response){
      if(!response.ok){
        throw Error(response.statusText);
      }
      return response.json();
    }).then(function(data) {
        localStorage.setItem(`${underscorify(city)}`, JSON.stringify(data));
        addCity();
        setUI();
        getOneCall();
      }).catch(function(error){
        alert(error);
      })
}

// Checks for existing buttons with city name as ID, if none then creates one
function addCity(){
  if($(`#${underscorify(city)}`).val() == null){
    searchHistory.append(`<button id="${underscorify(city)}" class="city waves-effect waves-light btn blue" style="margin-bottom: 1em;">${city}</button>`);
  }
}

// Sets data based on previously saved object from getAPI() then processes field information
function setUI(){
  let data = JSON.parse(localStorage.getItem(`${underscorify(city)}`));
  let icon = data.weather[0].icon;
  let src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  cityName.text(`${city} (${date})`);
  cityName.append(`<img src=${src} style="margin: -1em 0;"/>`);
  temp.text(`Temp: ${data.main.temp} °F`);
  wind.text(`Wind: ${data.wind.speed} MPH`);
  hum.text(`Humidity: ${data.main.humidity} %`);
}

// Refines which color the uvi indicator should be
function uviColor(data){
  if(data.current.uvi >= 7)
    UV.css(`background`, `red`);
    else if(data.current.uvi >= 3)
      UV.css(`background`, `orange`);
      else UV.css(`background`, `green`);
}

// Iterates over five cycles using i to define the day and the card being modified
// Passes data to populate the cards based on known key values from OneCall API
function fiveDay(data){
  for(let i=1; i<=5; i++){
    let futureDate = moment().add(i, 'd').format('L');
    let icon = data.daily[i].weather[0].icon;
    let src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    $(`#day${i}`).html(`
      <h4>${futureDate}</h4>
      <img src="${src}" style="margin: -1.5em;">
      <p>Temp: ${data.daily[i].temp.day} °F</p>
      <p>Wind: ${data.daily[i].wind_speed} MPH</p>
      <p>Humidity: ${data.daily[i].humidity} %</p>
    `);
    $(`#day${i}`).removeClass('hide');
  }
}

// Uses OneCall OpenWeatherAPI to get UVI levels and forecast days
function getOneCall(){
  let data = JSON.parse(localStorage.getItem(`${underscorify(city)}`));
  fetch(oneCallURL+`lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&appid=${APIKey}`)
    .then(response => response.json())
      .then(data => {
        UV.text(`${data.current.uvi}`);
        uviColor(data);
        fiveDay(data);
      })};
