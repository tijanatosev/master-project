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
  private user: User = new User();
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
  }

  public login(data) {
    this.currentUser.Username = data.value.username;
    this.currentUser.Password = data.value.password;
    this.currentUser.FirstName = "";
    this.currentUser.LastName = "";
    this.currentUser.Email = "";
    this.currentUser.UserType = "";
    this.userService.authenticateUser(this.currentUser.Username, this.currentUser).subscribe(result => {
      if (result != null) {
        var authValues = { "username": result.Username, "admin": result.UserType === "admin" };
        this.authService.login(authValues);
        this.router.navigate(['/dashboard']);
      }
    });

  }
}
