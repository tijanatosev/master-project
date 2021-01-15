import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../shared/services/user/user.model";
import { UserService } from "../shared/services/user/user.service";
import { AuthService } from "../shared/auth/auth.service";
import { Responses } from "../shared/enums";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  public registerInvalid = false;
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
      username: ['', [Validators.required, Validators.maxLength(32), this.validateUsername()]],
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required]]
    }, {
      validators: [this.validatePasswordsMatch(), this.validatePassword()]
    });

    this.userService.getUsers().subscribe(users => {
      this.existingUsers = users;
    });
  }

  save(data) {
    let user = new User();
    user.Username = data.value.username;
    user.FirstName = data.value.firstName;
    user.LastName = data.value.lastName;
    user.Email = data.value.email;
    user.Password = data.value.password;
    user.UserType = "user";
    this.userService.addUser(user).subscribe(result => {
      if (result == Responses.Created) {
        var authValues = { "username": user.Username, "admin": false }
        this.authService.login(authValues);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private validateUsername() {
    return (control: AbstractControl) => {
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
}
