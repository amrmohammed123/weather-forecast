import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { HistoricalWeatherService } from "../historical-weather.service";

@Component({
  selector: "statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"]
})
export class StatisticsComponent implements OnInit, OnChanges {
  @Input() currentCity: string;
  @Input() currentCountry: string;
  @Input() initChart;
  @Input() type: string;
  @Input() createDateFromUTC;
  @Output() setErrorMessageEvent = new EventEmitter();
  chartId = "statistics-chart";
  isStartDate = true;
  isStopDate = false;
  list = [];
  stopDate = new Date("1 jan 2010");
  currentDate: string;
  hourlyWeather: string;
  currentActiveButton = 0;
  currentProperty = "Temperature";
  currentPropertyAverageValue: string;
  currentPropertyUnit = "°C";
  constructor(private historicalWeatherService: HistoricalWeatherService) {}

  ngOnInit() {
    this.currentDate = this.getStartDate();
    this.generateList();
    this.init();
  }
  ngOnChanges() {
    this.init();
  }
  init() {
    // get historical weather data for current city, country
    this.historicalWeatherService
      .getCurrentWeather(
        this.currentCity + ", " + this.currentCountry,
        this.currentDate,
        this.type
      )
      .subscribe(
        weather => {
          let timeSeen = {};
          this.hourlyWeather = weather
            .map(weatherItem => {
              let item;
              if (this.type === "month") {
                // calculate the average of the day
                item = { tempC: 0, precipMM: 0, humidity: 0 };
                for (let i = 0; i < weatherItem.hourly.length; i++) {
                  item.tempC += parseFloat(weatherItem.hourly[i].tempC);
                  item.precipMM += parseFloat(weatherItem.hourly[i].precipMM);
                  item.humidity += parseFloat(weatherItem.hourly[i].humidity);
                }
                item.tempC /= weatherItem.hourly.length;
                item.precipMM /= weatherItem.hourly.length;
                item.humidity /= weatherItem.hourly.length;
              } else item = weatherItem;
              // return the object to draw {x(time), temperature, precipitation, humidity}
              let date =
                this.type === "month" ? weatherItem.date : item.UTCdate;
              let time = this.type === "month" ? "0" : item.UTCtime;
              return {
                x:
                  time === "0"
                    ? this.type === "month"
                      ? new Date(date)
                      : this.createDateFromUTC(`${date} 00:00 UTC`)
                    : this.createDateFromUTC(
                        `${date} ${time.substring(0, time.length - 2) +
                          ":" +
                          time.substring(time.length - 2)} UTC`
                      ),
                temperature: parseFloat(item.tempC),
                precipitation: parseFloat(item.precipMM),
                humidity: parseFloat(item.humidity)
              };
            })
            .filter(item => {
              // filter any duplicate data
              if (timeSeen[item.x]) return false;
              else {
                timeSeen[item.x] = true;
                return true;
              }
            });
          this.calculateAverage();
          // draw the line chart
          this.initChart(
            this.hourlyWeather,
            this.currentActiveButton,
            this.chartId,
            this.type
          );
        },
        err => this.setErrorMessageEvent.emit(err)
      );
  }
  setActiveButton(value: number) {
    switch (value) {
      case 0:
        this.currentProperty = "Temperature";
        this.currentPropertyUnit = "°C";
        break;
      case 1:
        this.currentProperty = "Humidity";
        this.currentPropertyUnit = "%";
        break;
      case 2:
        this.currentProperty = "Precipitation";
        this.currentPropertyUnit = "mm";
        break;
    }
    // set current active property (temp, humidity, precipitation)
    this.currentActiveButton = value;
    this.calculateAverage();
    // draw the line chart
    this.initChart(
      this.hourlyWeather,
      this.currentActiveButton,
      this.chartId,
      this.type
    );
  }

  onResize() {
    // redraw the lineChart on window resize
    this.initChart(
      this.hourlyWeather,
      this.currentActiveButton,
      this.chartId,
      this.type
    );
  }
  getNextDate() {
    // get next date(day or month according to the type)
    let currentDate =
      this.type === "month"
        ? new Date("1 " + this.currentDate)
        : new Date(this.currentDate);
    //check for the limit
    if (this.isStartDate) return null;
    else {
      // get next date
      if (this.type === "day")
        currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
      else currentDate.setMonth(currentDate.getMonth() + 1);
      // format the date
      let currentDateInfo = currentDate.toDateString().split(" ");
      return `${this.type === "day" ? currentDateInfo[2] + " " : ""}${
        currentDateInfo[1]
      } ${currentDateInfo[3]}`;
    }
  }
  getPreviousDate() {
    // get next date(day or month according to the type)
    let currentDate =
      this.type === "month"
        ? new Date("1 " + this.currentDate)
        : new Date(this.currentDate);
    //check for the limit
    if (this.isStopDate) return null;
    else {
      // get previous date
      if (this.type === "day")
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
      else currentDate.setMonth(currentDate.getMonth() - 1);
      // format the date
      let currentDateInfo = currentDate.toDateString().split(" ");

      return `${this.type === "day" ? currentDateInfo[2] + " " : ""}${
        currentDateInfo[1]
      } ${currentDateInfo[3]}`;
    }
  }
  generateList() {
    // generate list of dates since stop date till start date
    let currentDate =
      this.type === "month"
        ? new Date("1 " + this.currentDate)
        : new Date(this.currentDate);
    let currentDateInfo;
    while (currentDate >= this.stopDate) {
      currentDateInfo = currentDate.toDateString().split(" ");
      this.list.push(
        `${this.type === "day" ? currentDateInfo[2] + " " : ""}${
          currentDateInfo[1]
        } ${currentDateInfo[3]}`
      );
      if (this.type === "day")
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000);
      else currentDate.setMonth(currentDate.getMonth() - 1);
    }
  }
  setCurrentDate(currentDate) {
    // set current date in the format (day monthName Year) or (monthName Year) according to the type
    if (currentDate) {
      // change isStartDate, isStopDate according to new currentDate
      this.isStartDate =
        new Date(
          this.type === "month" ? "1 " + currentDate : currentDate
        ).getTime() === new Date(this.getStartDate()).getTime();
      this.isStopDate =
        new Date(
          this.type === "month" ? "1 " + currentDate : currentDate
        ).getTime() === this.stopDate.getTime();
      // set date
      this.currentDate = currentDate;
      // initialize component again
      this.init();
    }
  }
  getStartDate() {
    let currentDate = new Date();
    // if month set month for previous month
    if (this.type === "month") currentDate.setMonth(currentDate.getMonth() - 1);
    let currentDateInfo = currentDate.toDateString().split(" ");
    return `${this.type === "day" ? currentDateInfo[2] + " " : ""}${
      currentDateInfo[1]
    } ${currentDateInfo[3]}`;
  }
  calculateAverage() {
    // calculate current property average
    let average = 0;
    let propertyName = this.currentProperty.toLowerCase();
    for (let i = 0; i < this.hourlyWeather.length; i++) {
      average += this.hourlyWeather[i][propertyName];
    }
    average /= this.hourlyWeather.length;
    this.currentPropertyAverageValue = average.toFixed(2);
  }
}
