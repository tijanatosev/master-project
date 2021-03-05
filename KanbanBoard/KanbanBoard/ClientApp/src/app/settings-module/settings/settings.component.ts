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
  showBoards: boolean = false;
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
      this.showBoards = false;
      this.previous = 0;
      this.clicked = "none";
    } else if (option == 1) {
      this.showAccount = true;
      this.showNotifications = false;
      this.showLabels = false;
      this.showBoards = false;
      this.previous = 1;
      this.clicked = "account";
    } else if (option == 2) {
      this.showAccount = false;
      this.showNotifications = true;
      this.showLabels = false;
      this.showBoards = false;
      this.previous = 2;
      this.clicked = "notifications";
    } else if (option == 3) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showBoards = true;
      this.showLabels = false;
      this.previous = 3;
      this.clicked = "boards";
    } else if (option == 4) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showBoards = false;
      this.showLabels = true;
      this.previous = 4;
      this.clicked = "labels";
    }
  }
}
