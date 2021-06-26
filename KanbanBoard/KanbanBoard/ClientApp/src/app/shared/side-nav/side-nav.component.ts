import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { TimerService } from "../timer.service";
import {BoardService} from "../services/board/board.service";
import {Board} from "../services/board/board.model";

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
  private board: Board;

  constructor(private authService: AuthService,
              private router: Router,
              private timerService: TimerService,
              private boardService: BoardService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userId = this.authService.getUserIdFromToken();
    let timer = this.authService.getTimer();
    if (timer != null) {
      this.showTimer = true;
      this.timer = parseInt(this.authService.getCreated());
    }
    this.timerService.showTimer.subscribe(value => {
      if (value[1] && value[2]) {
        this.showTimer = value[0] == 1;
        this.createTimer(value[1], value[2], 0);
        this.updateTimerInLocalStorage(value[0], value[1], value[2]);
      }
    });
    this.timerService.break.subscribe(value => {
      if (value[0]) {
        this.createTimer(value[1], value[2], 1);
        this.updateTimerInLocalStorage(value[0], value[1], value[2]);
      }
    });
  }

  private createTimer(ticketId, boardId, type) {
    this.boardService.getBoard(boardId).subscribe(board => {
      this.board = board;
      let time = type == 0 ? this.board.WorkTime : this.board.BreakTime;
      this.timer = new Date(new Date().getTime() + (time * 60 * 1000)).getTime();
      this.authService.setCreated(this.timer);
      this.authService.setIterations(this.board.Iterations);
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updateTimerInLocalStorage(startStop, ticketId, boardId) {
    if (startStop == 0) {
      this.authService.setTimer(null);
      return;
    }
    let timer = { "ticketId": ticketId, "boardId": boardId };
    this.authService.setTimer(timer);
  }
}
