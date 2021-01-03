import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.css']
})
export class SettingsAccountComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  deleteForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: ['']
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

}
