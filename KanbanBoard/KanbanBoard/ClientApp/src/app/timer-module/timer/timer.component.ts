import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TimerOptionsComponent } from "../timer-options/timer-options.component";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public dateNow = new Date();
  public dDay = new Date(this.dateNow.getTime() + (25 * 60 * 1000));
  milliSecondsInASecond = 1000;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;

  private dialogTimerOptionsRef: MatDialogRef<any>;

  constructor(private timerOptionsDialog: MatDialog) { }

  ngOnInit() {
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
  }

  public showTimerOptions() {
    this.dialogTimerOptionsRef = this.timerOptionsDialog.open(TimerOptionsComponent);
  }
}
