import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showAccount: boolean = false;
  showNotifications: boolean = false;
  previous: number = 0;
  clicked: string;

  constructor() { }

  ngOnInit() {
  }

  show(option) {
    if (option == this.previous) {
      this.showAccount = false;
      this.showNotifications = false;
      this.previous = 0;
      this.clicked = "none";
    } else if (option == 1) {
      this.showAccount = true;
      this.showNotifications = false;
      this.previous = 1;
      this.clicked = "account";
    } else if (option == 2) {
      this.showAccount = false;
      this.showNotifications = true;
      this.previous = 2;
      this.clicked = "notifications";
    }
  }
}
