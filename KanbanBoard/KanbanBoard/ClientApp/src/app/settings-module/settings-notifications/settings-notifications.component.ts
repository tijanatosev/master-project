import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.component.html',
  styleUrls: ['./settings-notifications.component.css']
})
export class SettingsNotificationsComponent implements OnInit {
  notificationsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.notificationsForm = this.formBuilder.group({
      onCommentMine: [false],
      onComment: [false],
      onChange: [false],
      onStatusChangeMine: [false],
      onStatusChange: [false]
    });
  }

  public save(data) {
    this.snackBar.open("Successful", "DISMISS", {
      duration: 5000,
      panelClass: ["snack-bar"]
    });
  }
}
