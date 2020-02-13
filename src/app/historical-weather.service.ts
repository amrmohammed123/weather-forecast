import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HistoricalWeatherService {
  private baseUrl: string =
    "https://api.worldweatheronline.com/premium/v1/past-weather.ashx";
  constructor(private http: HttpClient) {}

  getCurrentWeather(location: string, date: string, type: string) {
    let dateQuery = "",
      endDateQuery = "";
    if (date) {
      if (new Date().toDateString() === new Date(data).toDateString()) {
        // check if date is today
        dateQuery = "";
      } else dateQuery = `&date=${date}`;
    }
    // set month related queries
    if (type === "month") {
      // set end date query
      let endDate = new Date("1 " + date);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setTime(endDate.getTime() - 24 * 60 * 60 * 1000);
      let endDateInfo = endDate.toDateString().split(" ");
      endDateQuery =
        "&enddate=" + `${endDateInfo[2]} ${endDateInfo[1]} ${endDateInfo[3]}`;
    }
    return this.http
      .get(
        `${this.baseUrl}?format=json&key=${environment.weatherApiKey}&q=${location}&extra=utcDateTime${dateQuery}${endDateQuery}`
      )
      .pipe(
        map(res => {
          if (type === "day") return (res as any).data.weather[0].hourly;
          else {
            return (res as any).data.weather;
          }
        }),
        catchError(err => {
          if (err.error && err.error.data)
            return throwError(err.error.data.error[0].msg);
          else if (err.data) return throwError(err.data.error[0].msg);
          else return throwError("Couldn't load data, something went wrong");
        })
      );
  }
}
