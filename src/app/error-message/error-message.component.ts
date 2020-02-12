import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "error-message",
  templateUrl: "./error-message.component.html",
  styleUrls: ["./error-message.component.css"]
})
export class ErrorMessageComponent implements OnInit {
  @Input() errorMessage: string;
  @Output() setErrorMessageEvent = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  clearErrorMessage() {
    this.setErrorMessageEvent.emit("");
  }
}
