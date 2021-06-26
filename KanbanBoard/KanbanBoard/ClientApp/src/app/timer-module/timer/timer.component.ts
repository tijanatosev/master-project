import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { interval, Subscription } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TimerOptionsComponent } from "../timer-options/timer-options.component";
import { BoardService } from "../../shared/services/board/board.service";
import { AuthService } from "../../shared/auth/auth.service";
import { Board } from "../../shared/services/board/board.model";
import {TimerService} from "../../shared/timer.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private MinutesInHour = 60;
  private SecondsInMinute = 60;
  private MillisecondsInSecond = 1000;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;

  private dialogTimerOptionsRef: MatDialogRef<any>;
  private board: Board;

  constructor(private timerOptionsDialog: MatDialog,
              private boardService: BoardService,
              private authService: AuthService,
              private timerService: TimerService) { }

  ngOnInit() {
    if (this.authService.getCreated() != null) {
      let timer = this.authService.getTimer();
      this.boardService.getBoard(timer.boardId).subscribe(board => this.board = board);
      let iterations = parseInt(this.authService.getIterations());
        this.subscription = interval(1000)
          .subscribe(x => {
            this.getTimeDifference(this.authService.getCreated(), new Date().getTime());
          });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getTimeDifference(created, lastTime) {
    this.timeDifference = created - lastTime;
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.MillisecondsInSecond) % this.SecondsInMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.MillisecondsInSecond * this.MinutesInHour) % this.SecondsInMinute);
    if (this.secondsToDday == 0 && this.minutesToDday == 0) {
      let timer = this.authService.getTimer();
      this.timerService.startBreak(timer.ticketId, timer.boardId);
    }
  }

  public showTimerOptions() {
    this.dialogTimerOptionsRef = this.timerOptionsDialog.open(TimerOptionsComponent);
  }

  public calculateWorkOrBreak() {
    let created = this.authService.getCreated();
    let time = this.board.WorkTime + this.board.BreakTime;
  }
}
