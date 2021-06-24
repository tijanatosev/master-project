import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { TimerService } from "../timer.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  public isExpanded: boolean = false;
  public isLoggedIn: Observable<boolean>;
  public userId: number;
  public showTimer: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private timerService: TimerService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userId = this.authService.getUserIdFromToken();
    this.timerService.showTimer.subscribe(value => {
      if (value[1] && value[2]) {
        this.showTimer = value[0] == 1;
      }
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
