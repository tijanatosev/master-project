import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../../shared/services/user/user.service";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/auth/auth.service";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.css']
})
export class SettingsAccountComponent implements OnInit {
  @Input() user;
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public dialogConfirmRef: MatDialogRef<any>;
  public hideCurrent = true;
  public hideNew = true;
  public hideConfirm = true;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private authService: AuthService,
              private confirmDialog: MatDialog,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.initProfileForm();
    this.initPasswordForm();
  }

  private initProfileForm() {
    this.profileForm = this.formBuilder.group({
      username: [this.user.Username, { validators: [Validators.required, Validators.maxLength(32), this.validateUsername()], updateOn: "change" }],
      firstName: [this.user.FirstName, { validators: [Validators.required, Validators.maxLength(64)], updateOn: "blur" }],
      lastName: [this.user.LastName, { validators: [Validators.required, Validators.maxLength(64)], updateOn: "blur" }],
      email: [this.user.Email, { validators: [Validators.required, Validators.email], updateOn: "blur" }]
    });
  }

  private initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', { validators: Validators.required, updateOn: "blur" }],
      newPassword: ['', { validators: Validators.required, updateOn: "blur" }],
      confirmPassword: ['', { validators: Validators.required, updateOn: "blur" }]
    }, {
      validators: [this.validatePasswordsMatch(), this.validatePassword(), this.validateCurrentAndNewPassword(), this.validateCurrentPassword()]
    });
  }

  public updateInformation(data) {
    if (data.value.username.length == 0 && data.value.firstName.length == 0 && data.value.lastName.length == 0 && data.value.email.length == 0) {
      return;
    }
    this.user.Username = data.value.username === "" ? this.user.Username : data.value.username;
    this.user.FirstName = data.value.firstName === "" ? this.user.FirstName : data.value.firstName;
    this.user.LastName = data.value.lastName === "" ? this.user.LastName : data.value.lastName;
    this.user.Email = data.value.email === "" ? this.user.Email : data.value.email;
    this.userService.updateUser(this.user.Id, this.user).subscribe(result => {
      if (result == Responses.Successful) {
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public updatePassword(data) {
    this.user.Password = data.value.newPassword;
    this.userService.updatePassword(this.user.Id, this.user).subscribe(result => {
      if (result == Responses.Successful) {
        this.passwordForm.reset();
        this.initPasswordForm();
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public onDeleteAccount() {
    this.dialogConfirmRef = this.confirmDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmRef.componentInstance.message = "Are you sure you want to permanently delete your account?";
    this.dialogConfirmRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmRef.componentInstance.cancelText = "No";

    this.dialogConfirmRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(this.user.Id).subscribe(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        });
      }
    });
  }

  private validateUsername() {
    return (control: AbstractControl) => {
      if (this.user.Username != control.value) {
        this.userService.getByUsername(control.value)
          .subscribe((user) => {
            if (user && user.Username === control.value) {
              control.setErrors({ 'usernameTaken': true });
            } else {
              return null;
            }
          });
      }
    }
  }

  private validatePasswordsMatch() {
    return (control: AbstractControl) => {
      return control.value.confirmPassword && control.value.confirmPassword.length != 0 && control.value.newPassword !== control.value.confirmPassword ?
        this.passwordForm.controls.confirmPassword.setErrors({'passwordsDoNotMatch': true}) : null
    };
  }

  private validatePassword() {
    return (control: AbstractControl) => {
      if (control.value.newPassword && control.value.newPassword.length != 0 && !/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,128}$/.test(control.value.newPassword)) {
        this.passwordForm.controls.newPassword.setErrors({ 'passwordIsNotStrong': true });
      } else {
        return null;
      }
    };
  }

  private validateCurrentAndNewPassword() {
    return (control: AbstractControl) => {
      if (control.value.currentPassword && control.value.newPassword && control.value.currentPassword &&
        control.value.currentPassword.length != 0 && control.value.newPassword.length != 0 &&
        control.value.currentPassword === control.value.newPassword) {
        this.passwordForm.controls.newPassword.setErrors({'passwordIsEqualToCurrent': true});
      } else {
        return null;
      }
    };
  }

  private validateCurrentPassword() {
    return (control: AbstractControl) => {
      if (control.value.currentPassword && control.value.currentPassword.length != 0) {
        this.user.Password = control.value.currentPassword;
        this.userService.checkPassword(this.user.Id, this.user).subscribe(result => {
          if (result == false) {
            this.passwordForm.controls.currentPassword.setErrors({'passwordIsNotCorrect': true});
          }
        });
      } else {
        return null;
      }
    };
  }
}
