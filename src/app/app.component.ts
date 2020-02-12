import { Component } from "@angular/core";
import { WeatherService } from "./weather.service";
import { LocationService } from "./location.service";
import { ILocalWeatherData } from "./ilocal-weather-data";
import * as countriesToCities from "../assets/countriesToCities.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  icons = {
    "395": "wi-snow",
    "392": "wi-snow",
    "389": "wi-rain",
    "386": "wi-rain",
    "377": "wi-snow",
    "374": "wi-snow",
    "371": "wi-snow",
    "368": "wi-snow",
    "365": "wi-sleet",
    "362": "wi-sleet",
    "359": "wi-rain",
    "356": "wi-rain",
    "353": "wi-rain",
    "350": "wi-snow",
    "338": "wi-snow",
    "335": "wi-snow",
    "332": "wi-snow",
    "329": "wi-snow",
    "326": "wi-snow",
    "323": "wi-snow",
    "320": "wi-sleet",
    "317": "wi-sleet",
    "314": "wi-rain",
    "311": "wi-rain",
    "308": "wi-rain",
    "305": "wi-rain",
    "302": "wi-rain",
    "299": "wi-rain",
    "296": "wi-rain",
    "293": "wi-rain",
    "284": "wi-rain",
    "281": "wi-rain",
    "266": "wi-rain",
    "263": "wi-rain",
    "260": "wi-fog",
    "248": "wi-fog",
    "230": "wi-snow-wind",
    "227": "wi-snow-wind",
    "200": "wi-thunderstorm",
    "185": "wi-rain",
    "182": "wi-sleet",
    "179": "wi-snow",
    "176": "wi-rain",
    "143": "wi-fog",
    "122": "wi-cloud",
    "119": "wi-cloud",
    "116": "wi-cloud",
    "113-sunny": "wi-day-sunny",
    "113-clear": "wi-night-clear"
  };
  localWeatherData: ILocalWeatherData;
  location: string = "Egypt";
  cities: string[];
  currentCity: string;
  errorMessage: string;
  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {}
  ngOnInit() {
    // get location
    this.locationService.getLocation().subscribe(
      location => {
        this.location = location;
        // get weather data
        this.weatherService.getLocalData(location).subscribe(
          data => {
            this.localWeatherData = data;
          },
          err => (this.errorMessage = err)
        );
        // set cities
        this.cities = (countriesToCities as any).default[
          location.toLowerCase()
        ];
      },
      err => (this.errorMessage = err)
    );
  }
}
