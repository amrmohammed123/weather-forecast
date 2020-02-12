import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class LocationService {
  private baseUrl: string = "https://api.ipdata.co/";
  constructor(private http: HttpClient) {}
  getLocation() {
    return this.http
      .get<string>(`${this.baseUrl}?api-key=${environment.ipdataKey}`)
      .pipe(
        map(res => (res as any).country_name),
        catchError(err => {
          return throwError("Couldn't load data, something went wrong");
        })
      );
  }
}
