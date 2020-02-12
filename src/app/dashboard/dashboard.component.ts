import { Component, OnInit, Input } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  @Input() currentCity: string;
  @Input() currentCountry: string;
  @Input() cities: string;
  @Input() icons;
  errorMessage: string;

  activeTab = 0;
  initChart = (data, currentActiveButton, id, type) => {
    // clear svg
    d3.selectAll(`#${id} > *`).remove();
    // use day of the date only if the type is month
    if (type === "month") {
      data = data.map(item => ({ ...item, x: item.x.getDate() }));
    }
    let y,
      yLabel,
      axisFontSize = "5px",
      labelFontSize = "10px";
    // choose property to draw on y-axis
    switch (currentActiveButton) {
      case 0:
        y = "temperature";
        yLabel = "Temperature °C";
        break;
      case 1:
        y = "humidity";
        yLabel = "Humidity %";
        break;
      case 2:
        y = "precipitation";
        yLabel = "Precipitation (mm)";
        break;
      default:
        y = "temperature";
        yLabel = "Temperature °C";
    }
    // get min and max date and y
    let minDate = data[0].x,
      maxDate = data[0].x,
      minY = data[0][y],
      maxY = data[0][y];
    for (let i = 1; i < data.length; i++) {
      if (data[i].x < minDate) minDate = data[i].x;
      if (data[i].x > maxDate) maxDate = data[i].x;
      if (data[i][y] < minY) minY = data[i][y];
      if (data[i][y] > maxY) maxY = data[i][y];
    }
    // select svg and set necessary variables
    let svg = d3.select(`#${id}`),
      width = parseFloat(svg.style("width").replace("px", "")),
      height = parseFloat(svg.style("height").replace("px", "")),
      marginLeft = 45,
      marginRight = 20,
      marginBottom = 30,
      marginTop = 30;
    let xScale;
    if (type === "month") {
      xScale = d3
        .scaleLinear()
        .range([marginLeft, width - marginRight])
        .domain([minDate, maxDate]);
    } else {
      xScale = d3
        .scaleTime()
        .range([marginLeft, width - marginRight])
        .domain([minDate, maxDate]);
    }
    let yScale = d3
      .scaleLinear()
      .range([height - marginTop, marginBottom])
      .domain([minY, maxY]);
    let xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickSizeOuter(0);
    if (type === "month") xAxis = xAxis.ticks(maxDate);
    let yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickSizeOuter(0);
    // set font size
    if (width >= 400) {
      axisFontSize = "7px";
    }
    if (width >= 500) {
      axisFontSize = "9px";
    }
    if (width >= 550) {
      axisFontSize = "10px";
    }
    // create grid lines
    const xAxisGrid = d3.axisBottom(xScale);
    const yAxisGrid = d3.axisLeft(yScale);
    // add vertical grid lines
    svg
      .append("g")
      .style("color", "#ccc")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxisGrid.tickSize(-height + 60).tickFormat(""));
    // add horizontal grid lines
    svg
      .append("g")
      .style("color", "#ccc")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxisGrid.tickSize(-width + 63).tickFormat(""));
    // add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .style("font-size", axisFontSize)
      .style("color", "#062864")
      .call(xAxis);
    // add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .style("font-size", axisFontSize)
      .style("color", "#062864")
      .call(yAxis);
    // create line
    let lineGen = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d[y]))
      .curve(d3.curveBasis);
    // add x-axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width - marginRight + 18)
      .attr("y", type === "month" ? height - 2 : height)
      .style("fill", "#062864")
      .style("font-weight", "bold")
      .style("font-size", labelFontSize)
      .text(type === "month" ? "Day Of Month" : "Time");
    // add y-axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("y", marginTop - 10)
      .attr("x", marginLeft + 36)
      .style("fill", "#062864")
      .style("font-weight", "bold")
      .style("font-size", labelFontSize)
      .text(yLabel);
    // add the line
    svg
      .append(`#${id}:path`)
      .attr("d", lineGen(data))
      .attr("stroke", "#062864")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  };
  createDateFromUTC(date: string) {
    // create date object using a UTC string
    let temp = date.split(" ");
    let temp2 = temp[0].split("-");
    let temp3 = temp[1].split(":");
    let year = parseInt(temp2[0]);
    let month = parseInt(temp2[1]) - 1;
    let day = parseInt(temp2[2]);
    let hour = parseInt(temp3[0]);
    let minute = parseInt(temp3[1]);
    return new Date(Date.UTC(year, month, day, hour, minute));
  }
  active(value: number) {
    // set current active tab
    this.activeTab = value;
  }
  constructor() {}
  ngOnInit() {}
}
