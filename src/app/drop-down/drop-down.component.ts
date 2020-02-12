import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";

@Component({
  selector: "drop-down",
  templateUrl: "./drop-down.component.html",
  styleUrls: ["./drop-down.component.css"]
})
export class DropDownComponent implements OnInit {
  @Input() title: string;
  @Input() list: string;
  @Output() setCurrentItemEvent = new EventEmitter();
  @Input() parentClassNames = "";
  @Input() titleClassNames = "";
  @Input() listClassNames = "";
  @Input() arrowClassNames = "";
  showList = false;
  clickedInside = false;

  constructor() {}
  ngOnInit() {}
  toggleShowList() {
    // hide or show the list
    this.showList = !this.showList;
  }
  setCurrentItem(item) {
    // pass current selected item to the parent
    this.setCurrentItemEvent.emit(item);
    this.showList = false;
  }
  @HostListener("click")
  clickInside() {
    // detect if there's a click inside the component
    this.clickedInside = true;
  }
  @HostListener("document:click")
  clickOut() {
    // check for click outside the component to close the list
    if (!this.clickedInside && this.showList) {
      this.showList = false;
    }
    this.clickedInside = false;
  }
}
