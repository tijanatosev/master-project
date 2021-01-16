import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../shared/services/user/user.service";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.css']
})
export class SettingsAccountComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  public dialogConfirmRef: MatDialogRef<any>;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private authService: AuthService,
              private confirmDialog: MatDialog) { }

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

  onDeleteAccount(id) {
    this.dialogConfirmRef = this.confirmDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmRef.componentInstance.message = "Are you sure you want to permanently delete your account?";
    this.dialogConfirmRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmRef.componentInstance.cancelText = "No";

    this.dialogConfirmRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        });
      }
    });
  }

}
