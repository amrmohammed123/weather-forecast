import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { WeatherSummaryComponent } from "./weather-summary/weather-summary.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { DropDownComponent } from "./drop-down/drop-down.component";
import { CurrentWeatherComponent } from "./current-weather/current-weather.component";
import { DailyStatisticsComponent } from './daily-statistics/daily-statistics.component';
import { MonthlyStatisticsComponent } from './monthly-statistics/monthly-statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherSummaryComponent,
    DashboardComponent,
    DropDownComponent,
    CurrentWeatherComponent,
    DailyStatisticsComponent,
    MonthlyStatisticsComponent
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
