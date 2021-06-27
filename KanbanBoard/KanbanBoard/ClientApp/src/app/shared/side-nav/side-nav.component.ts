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
  public timer: number;

  constructor(private authService: AuthService,
              private router: Router,
              private timerService: TimerService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userId = this.authService.getUserIdFromToken();
    let timer = this.authService.getTimer();
    if (timer != null) {
      this.showTimer = true;
      this.timer = parseInt(this.authService.getStartedTime());
    }
    this.timerService.showTimer.subscribe(value => {
      this.createTimer(value[0], value[1], value[2], value[3], value[4], value[5], value[6]);
      this.showTimer = value[0] == 1;
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private createTimer(startStop, ticketId, boardId, workTime, breakTime, longerBreak, iterations) {
    this.timer = new Date().getTime();
    this.authService.setStartedTime(this.timer);
    this.updateTimerInLocalStorage(startStop, ticketId, boardId, workTime, breakTime, longerBreak, iterations);
  }

  private updateTimerInLocalStorage(startStop, ticketId, boardId, workTime, breakTime, longerBreak, iterations) {
    if (startStop == 0) {
      this.authService.setTimer(null);
      return;
    }
    let timer = { "ticketId": ticketId, "boardId": boardId, "workTime": workTime, "breakTime": breakTime, "longerBreak": longerBreak, "iterations": iterations };
    this.authService.setTimer(timer);
  }
}
