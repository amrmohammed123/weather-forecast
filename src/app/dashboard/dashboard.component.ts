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

  activeTab = 0;
  initChart = (data, currentActiveButton, id) => {
    // clear svg
    d3.selectAll(`#${id} > *`).remove();
    let y,
      yLabel,
      axisFontSize = "7px",
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
        y = "percipitation";
        yLabel = "Percipitation (mm)";
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
      marginTop = 30,
      xScale = d3
        .scaleTime()
        .range([marginLeft, width - marginRight])
        .domain([minDate, maxDate]),
      yScale = d3
        .scaleLinear()
        .range([height - marginTop, marginBottom])
        .domain([minY, maxY]),
      xAxis = d3.axisBottom().scale(xScale),
      yAxis = d3.axisLeft().scale(yScale);
    // set font size
    if (width >= 400) {
      axisFontSize = "10px";
    }
    // add x-axis
    svg
      .append(`#${id}:g`)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .style("font-size", axisFontSize)
      .style("color", "#062864")
      .call(xAxis);
    // add y-axis
    svg
      .append(`#${id}:g`)
      .attr("transform", `translate(${marginLeft},0)`)
      .style("font-size", axisFontSize)
      .style("color", "#062864")
      .call(yAxis);

    let lineGen = d3
      .line()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d[y]);
      })
      .curve(d3.curveBasis);
    // add the line
    svg
      .append(`#${id}:path`)
      .attr("d", lineGen(data))
      .attr("stroke", "#062864")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    // add x-axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width - marginRight + 18)
      .attr("y", height)
      .style("fill", "#062864")
      .style("font-weight", "bold")
      .style("font-size", labelFontSize)
      .text("Time");
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
  };
  active(value: number) {
    this.activeTab = value;
  }
  constructor() {}
  ngOnInit() {}
}
