import { Component, OnInit, Input } from "@angular/core";
import { HistoricalWeatherService } from "../historical-weather.service";

@Component({
  selector: "daily-statistics",
  templateUrl: "./daily-statistics.component.html",
  styleUrls: ["./daily-statistics.component.css"]
})
export class DailyStatisticsComponent implements OnInit {
  @Input() currentCity: string;
  @Input() currentCountry: string;
  @Input() initChart;
  chartId = "daily-statistics-chart";
  isStartDate = true;
  isStopDate = false;
  daysList = [];
  stopDate = new Date("1-1-2010");
  currentDay: string;
  hourlyWeather: string;
  currentActiveButton = 0;
  constructor(private historicalWeatherService: HistoricalWeatherService) {}

  ngOnInit() {
    this.currentDay = this.today();
    this.generateList();
    this.init();
  }
  init() {
    this.historicalWeatherService
      .getCurrentWeather(
        this.currentCity + ", " + this.currentCountry,
        this.currentDay
      )
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
  onResize() {
    this.initChart(this.hourlyWeather, this.currentActiveButton, this.chartId);
  }
  getNextDay() {
    let currentDate = new Date(this.currentDay);
    //check for the limit
    if (this.isStartDate) return null;
    else {
      // get next day
      currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
      // format the date
      let currentDateInfo = currentDate.toDateString().split(" ");
      return `${currentDateInfo[2]} ${currentDateInfo[1]} ${currentDateInfo[3]}`;
    }
  }
  getPreviousDay() {
    let currentDate = new Date(this.currentDay);
    //check for the limit
    if (this.isStopDate) return null;
    else {
      // get previous day
      currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
      // format the date
      let currentDateInfo = currentDate.toDateString().split(" ");

      return `${currentDateInfo[2]} ${currentDateInfo[1]} ${currentDateInfo[3]}`;
    }
  }
  generateList() {
    // generate list of days since 1/1/2010 till today
    let currentDate = new Date(this.currentDay);
    let currentDateInfo;
    while (currentDate >= this.stopDate) {
      currentDateInfo = currentDate.toDateString().split(" ");
      this.daysList.push(
        `${currentDateInfo[2]} ${currentDateInfo[1]} ${currentDateInfo[3]}`
      );
      currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }
  }
  setCurrentDay(currentDay) {
    if (currentDay) {
      // change isStartDate, isStopDate according to new currentDate
      this.isStartDate =
        new Date(currentDay).getTime() === new Date(this.today()).getTime();
      this.isStopDate =
        new Date(currentDay).getTime() === this.stopDate.getTime();
      // set date
      this.currentDay = currentDay;
      // initialize component again
      this.init();
    }
  }
  today() {
    let currentDateInfo = new Date().toDateString().split(" ");
    return `${currentDateInfo[2]} ${currentDateInfo[1]} ${currentDateInfo[3]}`;
  }
}
