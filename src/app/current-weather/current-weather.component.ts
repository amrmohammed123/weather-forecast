import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { WeatherService } from "../weather.service";
import { HistoricalWeatherService } from "../historical-weather.service";
import { ILocalWeatherData } from "../ilocal-weather-data";

@Component({
  selector: "current-weather",
  templateUrl: "./current-weather.component.html",
  styleUrls: ["./current-weather.component.css"]
})
export class CurrentWeatherComponent implements OnInit, OnChanges {
  @Input() currentCity: string;
  @Input() currentCountry: string;
  @Input() icons;
  @Input() initChart;
  chartId = "current-weather-chart";
  localWeatherData: ILocalWeatherData;
  showCelsius = true;
  currentActiveButton = 0;
  hourlyWeather;

  constructor(
    private weatherService: WeatherService,
    private historicalWeatherService: HistoricalWeatherService
  ) {}

  ngOnInit() {
    this.init();
  }
  ngOnChanges() {
    this.init();
  }
  init() {
    this.weatherService
      .getLocalData(this.currentCity + ", " + this.currentCountry)
      .subscribe(data => {
        this.localWeatherData = data;
      });
    this.historicalWeatherService
      .getCurrentWeather(this.currentCity + ", " + this.currentCountry, null)
      .subscribe(weather => {
        let timeSeen = {};
        this.hourlyWeather = weather
          .map(item => ({
            x:
              item.UTCtime === "0"
                ? new Date(`${item.UTCdate} 00:00 UTC`)
                : new Date(
                    `${item.UTCdate} ${item.UTCtime.substring(
                      0,
                      item.UTCtime.length - 2
                    ) +
                      ":" +
                      item.UTCtime.substring(item.UTCtime.length - 2)} UTC`
                  ),
            temperature: parseInt(item.tempC),
            percipitation: parseInt(item.precipMM),
            humidity: parseInt(item.humidity)
          }))
          .filter(item => {
            if (timeSeen[item.x]) return false;
            else {
              timeSeen[item.x] = true;
              return true;
            }
          });
        this.initChart(
          this.hourlyWeather,
          this.currentActiveButton,
          this.chartId
        );
      });
  }
  setActiveButton(value: number) {
    this.currentActiveButton = value;
    this.initChart(this.hourlyWeather, this.currentActiveButton, this.chartId);
  }
  toggleTemperature() {
    this.showCelsius = !this.showCelsius;
  }

  onResize() {
    this.initChart(this.hourlyWeather, this.currentActiveButton, this.chartId);
  }
}
