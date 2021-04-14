import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../shared/services/user/user.model";
import { UserService } from "../shared/services/user/user.service";
import { AuthService } from "../shared/auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide = true;
  public hideRetype = true;

  public existingUsers: User[];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', { validators: [Validators.required, Validators.maxLength(32), this.validateUsername()], updateOn: "change" }],
      firstName: ['', { validators: [Validators.required, Validators.maxLength(64)], updateOn: "blur" }],
      lastName: ['', { validators: [Validators.required, Validators.maxLength(64)], updateOn: "blur" }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: "blur" }],
      password: ['', { validators: Validators.required, updateOn: "blur" }],
      checkPassword: ['', { validators: Validators.required, updateOn: "blur" }]
    }, {
      validators: [this.validatePasswordsMatch(), this.validatePassword(), this.validateFirstName(), this.validateLastName(), this.validateUsernameEmpty()]
    });

    this.userService.getUsers().subscribe(users => {
      this.existingUsers = users;
    });
  }

  public save(data) {
    let user = new User();
    user.Username = data.value.username.trim();
    user.FirstName = data.value.firstName.trim();
    user.LastName = data.value.lastName.trim();
    user.Email = data.value.email.trim();
    user.Password = data.value.password.trim();
    user.UserType = "user";
    this.userService.addUser(user).subscribe(userId => {
      if (userId) {
        var authValues = { "username": user.Username, "admin": false, "userId": userId }
        this.authService.login(authValues);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private validateUsername() {
    return (control: AbstractControl) => {
      this.userService.getByUsername(control.value.trim())
        .subscribe((user) => {
          if (user && user.Username === control.value.trim()) {
            control.setErrors({ 'usernameTaken': true });
          } else {
            return null;
          }
      });
    }
  }

  private validatePasswordsMatch() {
    return (control: AbstractControl) => {
      return control.value.checkPassword.length != 0 && control.value.password !== control.value.checkPassword ?
        this.registerForm.controls.checkPassword.setErrors({'passwordsDoNotMatch': true}) : null
    };
  }

  private validatePassword() {
    return (control: AbstractControl) => {
      if (control.value.password.length != 0 && !/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,128}$/.test(control.value.password)) {
        this.registerForm.controls.password.setErrors({ 'passwordIsNotStrong': true });
      } else {
        return null;
      }
    };
  }

  private validateUsernameEmpty() {
    return (control: AbstractControl) => {
      return control.value.username.length != 0 && control.value.username.trim().length == 0 ?
        this.registerForm.controls.username.setErrors({'usernameInvalid': true}) : null
    };
  }

  private validateFirstName() {
    return (control: AbstractControl) => {
      return control.value.firstName.length != 0 && control.value.firstName.trim().length == 0 ?
        this.registerForm.controls.firstName.setErrors({'firstNameInvalid': true}) : null
    };
  }

  private validateLastName() {
    return (control: AbstractControl) => {
      return control.value.lastName.length != 0 && control.value.lastName.trim().length == 0 ?
        this.registerForm.controls.lastName.setErrors({'lastNameInvalid': true}) : null
    };
  }
}
