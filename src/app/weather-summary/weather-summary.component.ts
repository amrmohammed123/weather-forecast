import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { WeatherService } from "../weather.service";
import { LocationService } from "../location.service";
import { ILocalWeatherData } from "../ilocal-weather-data";

@Component({
  selector: "weather-summary",
  templateUrl: "./weather-summary.component.html",
  styleUrls: ["./weather-summary.component.css"]
})
export class WeatherSummaryComponent implements OnInit {
  @Input() icons;
  @Input() location: string;
  @Input() localWeatherData: ILocalWeatherData;
  @Input() cities: string[];
  @Output() setCityEvent = new EventEmitter();
  time: string;
  showCelsius = true;

  ngOnInit() {
    // get current time
    this.time = new Date().toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  }
  toggleTemperature() {
    this.showCelsius = !this.showCelsius;
  }
  setCurrentCity(city: String) {
    this.setCityEvent.emit(city);
  }
}
