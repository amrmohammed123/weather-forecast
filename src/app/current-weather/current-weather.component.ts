import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
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
  @Input() createDateFromUTC;
  @Output() setErrorMessageEvent = new EventEmitter();
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
    // get current weather
    this.weatherService
      .getLocalData(this.currentCity + ", " + this.currentCountry)
      .subscribe(
        data => {
          this.localWeatherData = data;
        },
        err => this.setErrorMessageEvent.emit(err)
      );
    // get hourly weather for today
    this.historicalWeatherService
      .getCurrentWeather(
        this.currentCity + ", " + this.currentCountry,
        null,
        "day"
      )
      .subscribe(
        weather => {
          // get data to draw on the line chart and remove any dupliate data
          let timeSeen = {};
          this.hourlyWeather = weather
            .map(item => {
              return {
                x:
                  item.UTCtime === "0"
                    ? this.createDateFromUTC(`${item.UTCdate} 00:00 UTC`)
                    : this.createDateFromUTC(
                        `${item.UTCdate} ${item.UTCtime.substring(
                          0,
                          item.UTCtime.length - 2
                        ) +
                          ":" +
                          item.UTCtime.substring(item.UTCtime.length - 2)} UTC`
                      ),
                temperature: parseInt(item.tempC),
                precipitation: parseInt(item.precipMM),
                humidity: parseInt(item.humidity)
              };
            })
            .filter(item => {
              if (timeSeen[item.x]) return false;
              else {
                timeSeen[item.x] = true;
                return true;
              }
            });
          // create the line chart
          this.initChart(
            this.hourlyWeather,
            this.currentActiveButton,
            this.chartId
          );
        },
        err => this.setErrorMessageEvent.emit(err)
      );
  }
  setActiveButton(value: number) {
    // set current active proerty to draw (y value)
    this.currentActiveButton = value;
    this.initChart(this.hourlyWeather, this.currentActiveButton, this.chartId);
  }
  toggleTemperature() {
    // change temperature C to F or F to C
    this.showCelsius = !this.showCelsius;
  }
  onResize() {
    // recreate the chart on window resize
    this.initChart(this.hourlyWeather, this.currentActiveButton, this.chartId);
  }
}
