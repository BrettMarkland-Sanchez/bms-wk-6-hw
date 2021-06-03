let city;
const APIKey = 'a907d16219204ccff8dfbfc9285d5e56';
let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let citySearch = $('#citySearch');
let search = $('#search');

search.click(function(){
    city = citySearch.val();
    console.log(city);
    getAPI(queryURL);
});

function getAPI(queryURL){
    fetch(queryURL+`${city}&appid=${APIKey}`)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
}

