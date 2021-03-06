import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ILocalWeatherData } from "./ilocal-weather-data";
@Injectable({
  providedIn: "root"
})
export class WeatherService {
  private baseUrl: string =
    "https://api.worldweatheronline.com/premium/v1/weather.ashx";
  constructor(private http: HttpClient) {}

  getLocalData(location) {
    return this.http
      .get<ILocalWeatherData>(
        `${this.baseUrl}?format=json&key=${environment.weatherApiKey}&q=${location}`
      )
      .pipe(
        map(res => ({
          humidity: (res as any).data.current_condition[0].humidity,
          precipitation: (res as any).data.current_condition[0].precipMM,
          temp_C: (res as any).data.current_condition[0].temp_C,
          temp_F: (res as any).data.current_condition[0].temp_F,
          windSpeed: (res as any).data.current_condition[0].windspeedKmph,
          code: (res as any).data.current_condition[0].weatherCode,
          description: (res as any).data.current_condition[0].weatherDesc[0]
            .value
        })),
        catchError(err => {
          if (err.error && err.error.data)
            return throwError(err.error.data.error[0].msg);
          else if (err.data) return throwError(err.data.error[0].msg);
          else return throwError("Couldn't load data, something went wrong");
        })
      );
  }
}
