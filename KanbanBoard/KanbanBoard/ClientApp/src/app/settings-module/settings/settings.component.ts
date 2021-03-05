import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showAccount: boolean = false;
  showNotifications: boolean = false;
  showLabels: boolean = false;
  showStatuses: boolean = false;
  previous: number = 0;
  clicked: string;

  constructor() { }

  ngOnInit() {
  }

  show(option) {
    if (option == this.previous) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showLabels = false;
      this.showStatuses = false;
      this.previous = 0;
      this.clicked = "none";
    } else if (option == 1) {
      this.showAccount = true;
      this.showNotifications = false;
      this.showLabels = false;
      this.showStatuses = false;
      this.previous = 1;
      this.clicked = "account";
    } else if (option == 2) {
      this.showAccount = false;
      this.showNotifications = true;
      this.showLabels = false;
      this.showStatuses = false;
      this.previous = 2;
      this.clicked = "notifications";
    } else if (option == 3) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showLabels = true;
      this.showStatuses = false;
      this.previous = 3;
      this.clicked = "labels";
    } else if (option == 4) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showLabels = false;
      this.showStatuses = true;
      this.previous = 4;
      this.clicked = "statuses";
    }
  }
}
