import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  showAccount: boolean = false;
  showNotifications: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  show(option) {
    if (option == 1) {
      this.showAccount = true;
      this.showNotifications = false;
    } else if (option == 2) {
      this.showAccount = false;
      this.showNotifications = true;
    }
  }
}
