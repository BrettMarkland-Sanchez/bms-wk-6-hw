let city;
let searchHistory = $('#history');
const APIKey = 'a907d16219204ccff8dfbfc9285d5e56';
let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let citySearch = $('#citySearch');
let search = $('#search');
let cityName = $('#city');
let temp = $('#temp');
let wind = $('#wind');
let hum = $('#hum');
let UV = $('#UV');
let date = moment();

search.click(function(){
    city = citySearch.val();
    console.log(city);
    getAPI(queryURL);
    addCity();
    loadCity();
});

function getAPI(queryURL){
    fetch(queryURL+`${city}&appid=${APIKey}`)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        localStorage.setItem(`${city}`, JSON.stringify(data));
        console.log(data);
      });
}

function setUI(city){
  cityName.val(`${city} ${date}`);
}

function addCity(){
  searchHistory.append(`<button id="${city}" class="city waves-effect waves-light btn blue">${city}</button>`);
}

function loadCity(){
  let cityArr = $('.city');
  cityArr.forEach(element => {
    element.click(function(){
      // Load weather API values from JSON string in localStorage
      setUI();
    })
  });
}

