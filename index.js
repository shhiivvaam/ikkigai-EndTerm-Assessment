const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// variables
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");
getLocation();

// There is a possibility that when opening the application the user's session storage already have the coordinates present
// so making a simple call to { getFromSessionStorage } function to automatically render the users current location weather information, if available
getFromSessionStorage();



userTab.addEventListener("click", () => {
    // pass clicked tab as the input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    // pass clicked tab as the input parameter
    switchTab(searchTab);
})



// Function to Handle Tab Switching between user Tab and Current Tab
function switchTab(clickedTab) {                              //! current Tab -> old Tab
    if (clickedTab != currentTab) {                            //! clicked Tab -> new Tab
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // if the previous location is search tab and now want to go to the your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");

            // Now currently at { Your Weather } Tab and so have to display weather as well
            // ans so checking the local storage for the coordinates and get the desired location data if saved.
            getFromSessionStorage();
        }

    }
}

// To get the location data previously fetched and saved in the session storage to use it again and again (Whenever the user presses the { Your Weather } Tab)
// check if the coordinates are already present in the session storage  
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // if the location coordinates are not saved
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// Function to make the API call if we have the coordinates of the user that he/she is demanding the weathetr info for:
async function fetchUserWeatherInfo(coordinates) {
    const { latitude, longitude } = coordinates;

    // make Grant Location Container Invisible
    grantAccessContainer.classList.remove("active");

    // make loader { Locading Screen Visible }
    loadingScreen.classList.add("active");

    // API CALL

    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // since now till this step we must have got the data -> the coordinates of the user and the API call must have given the required information 
        //* so now we must remove the Loader here {  Loading Screen (gif)}
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        //! This function will be responsible to dynamically render the data to the UI that has been fetched from the API CALL
        renderWeatherInfo(data);

    } catch (error) {

        loadingScreen.classList.remove("active");
        console.log("Error : ", error);
    }
}

// Function to render the User Weather Info to the UI dynamically 
function renderWeatherInfo(weatherInfo) {

    // first we have to fetch the respective data
    const cityName = document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherdesc]");
    const weatherIcon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo)

    // fetch values from weather Info object and put in the UI elements created above
    cityName.innerHTML = weatherInfo?.name ? weatherInfo?.name : `Not Available`;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = weatherInfo?.weather?.[0]?.description || 'No description Available';
    weatherIcon.src = weatherInfo?.weather?.[0]?.icon
        ? `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
        : `https://flagcdn.com/16x12/in.png`;
    //${weatherInfo?.weather?.[0]?.icon}
    temp.innerHTML = weatherInfo?.main?.temp ? `${weatherInfo?.main?.temp} °C` : `Not Available`;
    windspeed.innerHTML = weatherInfo?.wind?.speed ? `${weatherInfo?.wind?.speed} m/s` : `Not Available`;
    humidity.innerHTML = weatherInfo?.main?.humidity ? `${weatherInfo?.main?.humidity} %` : `Not Available`;
    cloudiness.innerHTML = `${weatherInfo?.clouds?.all} %`;
}


// Grant Acces Location Button -> Listener

// to fetch the coordinates
// ask permission for accessing geo-location
// to save the coordinates in the Local Storage (Session Storage)
const grantAccessButton = document.querySelector("[data-grantaccess]");
grantAccessButton.addEventListener("click", getLocation);


// Weather Search from users Desired Lcoation -> from input Container
const searchInput = document.querySelector("[data-searchinput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if (cityName === "") return;
    fetchSearchWeatherInfo(cityName);

    // if(searchInput.value === "") return;
    // fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (error) {
        console.log("Error : ", error);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("No Geo-Location Support Available 👎👎");
    }
}

function showPosition(position) {
    const userCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}