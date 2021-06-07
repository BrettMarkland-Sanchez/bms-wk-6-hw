let searchHistory = $('#history');
const APIKey = 'a907d16219204ccff8dfbfc9285d5e56';
let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let citySearch = $('#citySearch');
let search = $('#search');
let city;
let cityName = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let hum = $('#hum');
let UV = $('#UV');
let date = moment().format('L');

search.click(function(){
    city = citySearch.val();
    getAPI(queryURL); 
});

function underscorify(city){
  let cityKey = city.replace(/ /g,"_");
  return cityKey;
}

function spacify(cityKey){
  let city = cityKey.replace("_",/ /g);
  return city;
}

function getAPI(queryURL){
  fetch(queryURL+`${city}&appid=${APIKey}`)
    .then(function(response){
      if(!response.ok){
        throw Error(response.statusText);
      }
      return response.json();
    }).then(function(data) {
        localStorage.setItem(`${underscorify(city)}`, JSON.stringify(data));
        addCity();
        setUI();
      }).catch(function(error){
        alert(error);
      })
}

function addCity(){
  if($(`#${underscorify(city)}`).val() == null ){
    searchHistory.append(`<button id="${underscorify(city)}" class="city waves-effect waves-light btn blue" style="margin-bottom: 1em;">${city}</button>`);
  }
}

function setUI(){
  let data = JSON.parse(localStorage.getItem(`${underscorify(city)}`));
  let icon = data.weather[0].icon;
  let src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  cityName.text(`${city} (${date})`);
  cityName.append(`<img src=${src} style="height:2em; margin-bottom: -.5em;"/>`);
}
