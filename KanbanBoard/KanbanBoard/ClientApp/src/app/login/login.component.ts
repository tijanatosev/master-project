import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from "../shared/services/user/user.model";
import { UserService } from "../shared/services/user/user.service";
import { AuthService } from "../shared/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public loginInvalid = false;
  public hide = true;
  public users: User[];
  private currentUser: User = new User();

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  public login(data) {
    this.currentUser.Username = data.value.username;
    this.currentUser.Password = data.value.password;
    this.currentUser.UserType = "";
    if (!this.userExists(this.currentUser)) {
      return;
    }
    var authValues = { "username": this.currentUser.Username, "admin": this.currentUser.UserType === "admin" };
    this.authService.login(authValues);
    this.router.navigate(['/dashboard']);
  }

  private userExists(user: User): boolean {
    var exists: boolean = false;
    this.users.forEach(value => {
      if (value.Username === user.Username && value.Password === user.Password) {
        this.currentUser.UserType = value.UserType;
        exists = true;
      }
    });
    return exists;
  }
}
