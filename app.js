const isEmpty = (obj) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

class UI {
    constructor() {
        this.weatherCard = document.querySelector(".weather-card");
        this.alert = document.querySelector(".alert");
    }

    showCityInfo(weather = {}) {
        if (!isEmpty(weather) && weather.cod !== "404" && weather.cod !== "400") {
            const {
                sys: { country: countryname = "" } = {},
                name: cityname = "",
                main: { temp = "", humidity = "" } = {},
                wind: { speed: wind = "" } = {},
            } = weather;
            const celcius = Math.round(temp - 273);
            const loading = document.querySelector(".loading");

            let html = `
              <img src="img/cload.svg">
              <div class="degree">${celcius}C</div>
              <div class="content">
                  <div class="content-wind">
                      <i class="fas fa-wind"></i>
                      <span>${wind}m/s</span>
                  </div>
                  <div class="content-clouds">
                      <i class="fas fa-tint"></i>
                      <span>${humidity} %</span>
                  </div>
              </div>
              <div class="city">${cityname},${countryname}</div>
              `;
            let card;

            function getCityById(cityName) {
                card = document.getElementById(cityName);
                card.innerHTML = html;
            }

            if (cityname === "Istanbul") {
                getCityById("istanbul");
            } else if (cityname === "Ankara") {
                getCityById("ankara");
            } else {
                card = document.getElementById("cityResult");
                card.style.display = "none";
                loading.style.display = "block";
                setTimeout(() => {
                    loading.style.display = "none";
                    card.style.display = "block";
                    card.innerHTML = html;
                }, 1500);
            }
        } else return null;
    }
    showError() {
        let html = `
            <div class="alert-danger">
                City not founded or input is empty.
            </div>
        `;
        document.querySelector(".alert").innerHTML = html;
        setTimeout(() => {
            document.querySelector(".alert").innerHTML = "";
        }, 1500);
    }
}
const ui = new UI();

class City {
    constructor() { }
    async getCity(city) {
        try {
            if (!!city) {
                const cityWeather = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ff2a1ee84b40047c43fe30cb274f96f3`
                );
                const response = await cityWeather.json();
                ui.showCityInfo(response);
            }
        } catch {
            console.error("Error occured.");
        }
    }
    async getDefaultCityInfoByName(cityName) {
        const cityUrl = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ff2a1ee84b40047c43fe30cb274f96f3`
        ).then((response) => response.json());
        ui.showCityInfo(cityUrl);
    }
}

let dark = localStorage.getItem("dark");

class Storage {
    static enableDarkMode() {
        document.body.classList.add("dark");
        localStorage.setItem("dark", "enabled");
    }

    static disableDarkMode() {
        document.body.classList.remove("dark");
        localStorage.setItem("dark", null);
    }
}

//Dark mode
if (dark === "enabled") {
    Storage.enableDarkMode();
}

const checkbox = document.getElementById("check");
checkbox.addEventListener("click", () => {
    dark = localStorage.getItem("dark");
    if (dark !== "enabled") {
        Storage.enableDarkMode();
    } else {
        Storage.disableDarkMode();
    }
});

let city = new City();

const btnSearch = document.querySelector(".btnSearch");
const valueCity = document.querySelector(".inputCity");

city.getDefaultCityInfoByName("istanbul");
city.getDefaultCityInfoByName("ankara");

btnSearch.addEventListener("click", () => {
    city.getCity(valueCity.value);
});
