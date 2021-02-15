import { Component } from '@angular/core';
import { AuthService } from "./shared/auth/auth.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private browserRefresh: boolean;

  constructor(private authService: AuthService,
              private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.setLastVisited(this.router.url);
      }
    });
    if (this.authService.isAuthenticated()) {
      if (this.authService.getLastVisited()) {
        router.navigateByUrl(this.authService.getLastVisited());
      } else {
        router.navigate(['/dashboard']);
      }
    }
  }

}
