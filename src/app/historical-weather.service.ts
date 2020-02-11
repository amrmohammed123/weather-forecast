import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HistoricalWeatherService {
  private baseUrl: string =
    "https://api.worldweatheronline.com/premium/v1/past-weather.ashx";
  constructor(private http: HttpClient) {}

  getCurrentWeather(location: string, date: string) {
    let dateQuery = "";
    if (date) dateQuery = `&date=${date}`;
    console.log(dateQuery);
    return this.http
      .get(
        `${this.baseUrl}?format=json&key=${environment.weatherApiKey}&q=${location}&extra=utcDateTime${dateQuery}`
      )
      .pipe(map(res => (res as any).data.weather[0].hourly));
  }
}
