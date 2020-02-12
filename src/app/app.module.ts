import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { WeatherSummaryComponent } from "./weather-summary/weather-summary.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { DropDownComponent } from "./drop-down/drop-down.component";
import { CurrentWeatherComponent } from "./current-weather/current-weather.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherSummaryComponent,
    DashboardComponent,
    DropDownComponent,
    CurrentWeatherComponent,
    StatisticsComponent,
    ErrorMessageComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
