import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "monthly-statistics",
  templateUrl: "./monthly-statistics.component.html",
  styleUrls: ["./monthly-statistics.component.css"]
})
export class MonthlyStatisticsComponent implements OnInit {
  @Input() currentCity: string;
  @Input() currentCountry: string;
  @Input() initChart;
  constructor() {}

  ngOnInit() {}
}
