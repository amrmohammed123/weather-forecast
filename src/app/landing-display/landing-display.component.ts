import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ILocalWeatherData } from "../ilocal-weather-data";

@Component({
  selector: "landing-display",
  templateUrl: "./landing-display.component.html",
  styleUrls: ["./landing-display.component.css"]
})
export class LandingDisplayComponent implements OnInit {
  @Input() icons;
  @Input() location: string;
  @Input() localWeatherData: ILocalWeatherData;
  @Input() cities: string[];
  @Output() setCityEvent = new EventEmitter();
  time: string;
  showCelsius = true;

  constructor() {}
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
    // change temperature in °C to °F and the reverse
    this.showCelsius = !this.showCelsius;
  }
  setCurrentCity(city: String) {
    // set the selected city
    this.setCityEvent.emit(city);
  }
}
