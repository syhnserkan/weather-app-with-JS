
class UI{
    constructor(){
        this.weatherCard=document.querySelector('.weather-card');
        this.alert=document.querySelector('.alert');
    }

    showCityInfo(weather){
        const countryname=weather['sys']['country'];
        const cityname=weather['name'];
        const celcius=Math.round(weather['main']['temp']-273);
        const wind=weather['wind']['speed'];
        const humidity=weather['main']['humidity'];
        const loading=document.querySelector('.loading');
        console.log(weather['name']);
        // console.log(humidity);
        let html=`
        <img src="img/cload.svg">
        <div class="degree">${celcius}°C</div>
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
        //console.log(celcius);
        if(weather['name']=='Istanbul'){
            card=document.getElementById('istanbul');
            card.innerHTML=html;
        }
        else if(weather['name']=='Ankara'){
            card=document.getElementById('ankara');
            card.innerHTML=html;
        }
        else{
            card=document.getElementById('cityResult');
            card.style.display="none";
            loading.style.display="block";
            setTimeout(()=>{ // show for load gif.
                loading.style.display="none";
                card.style.display="block";
                card.innerHTML=html;
            },1500);
        }
        
    }
    showError(err){
        let html=`
            <div class="alert-danger">
                City not founded or input is empty.
            </div>
        `;
        document.querySelector('.alert').innerHTML=html;
        setTimeout(()=>{
            document.querySelector('.alert').innerHTML="";
        },1500)
    }
}

const ui=new UI();

class City{
    constructor(){

    }

    async getCity(city){
        const cityWeather=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ff2a1ee84b40047c43fe30cb274f96f3`)
        .then(response =>{
            return response.json();
        })
        .then(weather=>{
            ui.showCityInfo(weather);
        })
        .catch(err=>{
            ui.showError(err);
        })
        return cityWeather;
    }

    async getDefaultCity(){
        const istanbulURL=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=istanbul&appid=ff2a1ee84b40047c43fe30cb274f96f3`)
        const istanbul = await istanbulURL.json();

        const ankaraURL=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=ankara&appid=ff2a1ee84b40047c43fe30cb274f96f3`)
        const ankara = await ankaraURL.json();
        return{
            istanbul,
            ankara
        }
    }
}



let dark=localStorage.getItem('dark'); // dark mode

class Storage{
    static enableDarkMode(){
        // add class to the body
        document.body.classList.add('dark');
        //update darkmode in LS
        localStorage.setItem('dark','enabled');
    }

    static disableDarkMode(){
        //remove class to the body
        document.body.classList.remove('dark');
        //update darkmode in LS
        localStorage.setItem('dark',null);
    }
}

//Dark mode
if(dark==='enabled'){ // If the user already visited and enabled dark mode
    Storage.enableDarkMode();
}

const checkbox=document.getElementById('check');
checkbox.addEventListener('click',()=>{
    dark=localStorage.getItem('dark'); // get their dark setting
    
    if(dark!=='enabled'){
        Storage.enableDarkMode();
    }
    else{
        // if it has been enabled, turn it off.
        Storage.disableDarkMode();
    }
});

// Call fetch api for weather
let city=new City();

const btnSearch=document.querySelector('.btnSearch');
const valueCity=document.querySelector('.inputCity');

city.getDefaultCity() // load default city weather
.then(response=>{
    ui.showCityInfo(response.istanbul);
    ui.showCityInfo(response.ankara);
});

btnSearch.addEventListener('click',()=>{
    // console.log(valueCity.value);
    city.getCity(valueCity.value);
});