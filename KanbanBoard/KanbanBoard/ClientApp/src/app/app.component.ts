import { Component } from '@angular/core';
import { AuthService } from "./shared/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.isAuthenticated()) {
      router.navigate(['/dashboard']);
    }
  }

}
