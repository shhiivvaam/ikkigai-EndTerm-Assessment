console.log('shhiivvaam');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

function renderWeatherInfo(data) {
    // Adding to the UI
    let newPara = document.createElement('p');
    // newPara.textContent = data;
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
    document.body.appendChild(newPara);
    // console.log(newPara);
}

async function fetchWeatherDetails() {

    try {

        let city = 'goa';

        const respose = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await respose.json();

        console.log('Weather Data : ', data);

        // below two are wrong syntax   -> add comma instead of + sign
        // console.log('Weather Data : ' + `${data}`);
        // console.log('Weather Data : ' + data);

        console.log('Weather Data : ' + `${data?.main?.temp.toFixed(2)} °C`);

        renderWeatherInfo(data);

    } catch (error) {
        console.log('Error : ', error);
    }
}

// async function getCustomWeatherDetails(latitude = 15.6333, longitude = 18.3333) {
async function getCustomWeatherDetails() {
    try {
        // let latitude = this.latitude;
        // let longitude = this.longitude;

        let latitude = 15.6333;
        let longitude = 18.3333;

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        console.log('Weather Data : ', data);
    } catch (error) {
        console.log('Error : ', error);
    }
}

function switchTab(clickedTab) {
    apiErrorContainer.classList.remove('active');

    if (clickedTab != currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchFrom.classList.contains('active')) {
            userInfoContainer.classList.remove('active');
            searchFrom.classList.add('active');
        } else {
            searchFrom.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getFromSessionStorage();
        }

        // console.log("Current Tab", currentTab);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log('No GeoLocation Support');
    }
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    console.log(latitude);
    console.log(longitude);
}