import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from "rxjs";
import { BoardService } from "../../shared/services/board/board.service";
import { AuthService } from "../../shared/auth/auth.service";
import { SnackBarService } from "../../shared/snack-bar.service";
import { TimerService } from "../../shared/timer.service";
import { Router } from "@angular/router";

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
  private HoursInDay = 24;
  private timer = null;
  private startedTime = null;
  private modSeconds;

  public timeDifference;
  public seconds;
  public minutes;
  public hours;

  public isBreak: boolean = false;
  public isLongerBreak: boolean = false;
  private firstTimeBreak: boolean = false;
  private secondsForAlarm: number = 1;
  private alarm;

  constructor(private boardService: BoardService,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              private timerService: TimerService,
              private router: Router) { }

  ngOnInit() {
    this.timer = this.authService.getTimer();
    this.startedTime = this.authService.getStartedTime();
    if (this.startedTime != null && this.timer != null) {
      this.subscription = interval(1000)
        .subscribe(x => {
          this.getTimeDifference(this.authService.getStartedTime(), this.timer.workTime, this.timer.breakTime, this.timer.longerBreak, this.timer.iterations);
        });
    }
    this.alarm = new Audio("../../../Resources/Sounds/alarm.wav");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getTimeDifference(startedTime, workTime, breakTime, longerBreak, iterations) {
    let workTimeInSeconds = workTime * this.SecondsInMinute;
    let breakTimeInSeconds = breakTime * this.SecondsInMinute;
    let longerBreakInSeconds = longerBreak * this.SecondsInMinute;
    let secondsInAllIterations = iterations * workTimeInSeconds + (iterations - 1) * breakTimeInSeconds;

    this.timeDifference = this.calculateTimeDifference(startedTime);
    this.isLongerBreak = this.timeDifference >= secondsInAllIterations;
    this.modSeconds = this.isLongerBreak ?
      this.timeDifference % secondsInAllIterations :
      this.timeDifference % (workTimeInSeconds + breakTimeInSeconds);

    this.isBreak = this.modSeconds >= workTimeInSeconds;

    this.firstTimeBreak = this.isBreak || this.isLongerBreak;
    if (this.firstTimeBreak && this.secondsForAlarm > 0) {
      this.firstTimeBreak = false;
      this.secondsForAlarm--;
      this.alarm.load();
      this.alarm.play();
    }
    if (!this.isBreak && !this.isLongerBreak && this.secondsForAlarm == 0) {
      this.secondsForAlarm = 1;
      this.alarm.load();
      this.alarm.play();
    }

    if (this.timeDifference > (secondsInAllIterations + longerBreakInSeconds)) {
      this.authService.setStartedTime(new Date().getTime());
      this.snackBarService.timerFinishedPomodoro(this.timer.ticketId);
      return;
    }

    this.allocateTimeUnits(this.determineTimeInSeconds(this.modSeconds, workTimeInSeconds, breakTimeInSeconds, longerBreakInSeconds));
  }

  private allocateTimeUnits(trueTimeLeftForTimer) {
    this.seconds = Math.floor((trueTimeLeftForTimer) / (this.MillisecondsInSecond) % this.SecondsInMinute);
    this.minutes = Math.floor((trueTimeLeftForTimer) / (this.MillisecondsInSecond * this.MinutesInHour) % this.SecondsInMinute);
    this.hours = Math.floor((trueTimeLeftForTimer) / (this.MillisecondsInSecond * this.MinutesInHour * this.SecondsInMinute) % this.HoursInDay);
  }

  private calculateTimeDifference(startedTime) {
    let timestamp = Math.round(new Date().getTime() / this.MillisecondsInSecond);
    let startedTimeInSeconds = Math.round(startedTime / this.MillisecondsInSecond);
    return timestamp - startedTimeInSeconds;
  }

  private determineTimeInSeconds(modSeconds, workTimeInSeconds, breakTimeInSeconds, longerBreakInSeconds) {
    let intervalTimeInMilliSeconds = (this.isLongerBreak ? longerBreakInSeconds : (this.isBreak ? breakTimeInSeconds : workTimeInSeconds)) * this.MillisecondsInSecond;
    return intervalTimeInMilliSeconds - (this.isLongerBreak ? (modSeconds) : (this.isBreak ? (modSeconds % workTimeInSeconds) : modSeconds)) * this.MillisecondsInSecond;
  }

  private destroyTimer() {
    this.snackBarService.timerFinishedPomodoro(this.timer.ticketId);
    this.ngOnDestroy();
    this.timerService.startStopTimer(0, this.timer.ticketId, this.timer.boardId, this.timer.workTime, this.timer.breakTime, this.timer.longerBreak, this.timer.iterations);
  }

  public goToTask() {
    this.router.navigate(["task", this.timer.ticketId])
  }
}
