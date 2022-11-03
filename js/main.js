//Today's Card Variables:
let today = document.getElementById("today"),
  todayDate = document.getElementById("today-date"),
  cityLocation = document.getElementById("location"),
  todayDegree = document.getElementById("today-degree"),
  todayIcon = document.getElementById("today-icon"),
  description = document.getElementById("today-description"),
  humidty = document.getElementById("humidty"),
  wind = document.getElementById("wind"),
  compass = document.getElementById("compass"),
  searchBar = document.getElementById("search-bar"),
  apiResponse,
  responseData,
  monthName = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Spet",
    "Oct",
    "Nov",
    "Dec",
  ],
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//Next Days Variables:
let nextDay = document.getElementsByClassName("nextDay"),
  nextDayIcon = document.getElementsByClassName("nextDay-icon"),
  maxDegree = document.getElementsByClassName("max-degree"),
  minDegree = document.getElementsByClassName("min-degree"),
  nextDayDescription = document.getElementsByClassName("nextDay-description");

//Current Location By ip address
async function getCurrentLocation() {
  const { city } = await (
    await fetch(
      `https://api.ipdata.co/?api-key=172ab819194ba1cf89f27237527a7fe1e97b282fd8005f9e449af250`
    )
  ).json();
  return city;
}

//remove a letters with accents in polish cities
// soon this fuction will be updated for other countries and cities
async function removeAccents() {
  let city = await getCurrentLocation();
  const mapping = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };

  return city
    .split("")
    .map((char) => (Object.keys(mapping).includes(char) ? mapping[char] : char))
    .join("");
}

//fetching the weather data
async function getWeatherData(currentCity) {
  if (currentCity == undefined) {
    currentCity = await removeAccents();
  }
  console.log(currentCity);
  apiResponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=4cebe15275c847b0942160532220311&q=${currentCity}&days=3`
  );
  responseData = await apiResponse.json();
  dispalyTodayWeather();
  displayDysWeather();
}
getWeatherData();

// current date
function dispalyTodayWeather() {
  let date = new Date();
  today.innerHTML = days[date.getDay()];
  todayDate.innerText = `${date.getDate()} ${monthName[date.getMonth()]}`;
  cityLocation.innerHTML = responseData.location.name;
  todayDegree.innerHTML = responseData.current.temp_c;
  todayIcon.setAttribute("src", `https:${responseData.current.condition.icon}`);
  description.innerHTML = responseData.current.condition.text;
  humidty.innerHTML = responseData.current.humidity;
  wind.innerHTML = responseData.current.wind_kph;
  compass.innerHTML = responseData.current.wind_dir;
}

function displayDysWeather() {
  for (let i = 0; i < nextDay.length; i++) {
    nextDay[i].innerHTML =
      days[new Date(responseData.forecast.forecastday[i + 1].date).getDay()];
    nextDayIcon[i].setAttribute(
      "src",
      `https:${responseData.forecast.forecastday[i + 1].day.condition.icon}`
    );
    maxDegree[i].innerHTML =
      responseData.forecast.forecastday[i + 1].day.maxtemp_c;
    minDegree[i].innerHTML =
      responseData.forecast.forecastday[i + 1].day.mintemp_c;
    nextDayDescription[i].innerHTML =
      responseData.forecast.forecastday[i + 1].day.condition.text;
  }
}

searchBar.addEventListener("keyup", function () {
  currentCity = searchBar.value;
  getWeatherData(currentCity);
});
