import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { TimerService } from "../timer.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private timerService: TimerService) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return (!(token === undefined || token === null || token === 'undefined' || token === 'null' || token === ''));
  }

  public login(data) {
    this.loggedIn.next(true);
    localStorage.setItem('token', JSON.stringify(data));
  }

  public logout() {
    this.loggedIn.next(false);
    localStorage.setItem('token', undefined);
    let timer = this.getTimer();
    if (timer != null) {
      this.timerService.startStopTimer(0, timer.ticketId, timer.boardId, timer.workTime, timer.breakTime, timer.longerBreak, timer.iterations);
      localStorage.setItem('timer', null);
      localStorage.setItem('startedTime', null);
    }
  }

  get isLoggedIn() {
    if (this.isAuthenticated()) {
      this.loggedIn.next(true);
    }
    return this.loggedIn.asObservable();
  }

  public isAdmin() {
    if (!this.isAuthenticated()) {
      return false;
    }
    const token = JSON.parse(localStorage.getItem('token'));
    return token.admin;
  }

  public getUserIdFromToken() {
    if (!this.isAuthenticated()) {
      return null;
    }
    const token = JSON.parse(localStorage.getItem('token'));
    return token.userId;
  }

  public getUsernameFromToken() {
    if (!this.isAuthenticated()) {
      return null;
    }
    const token = JSON.parse(localStorage.getItem('token'));
    return token.username;
  }

  public getLastVisited() {
    return this.getFromLocalStorage("lastVisited");
  }

  public setLastVisited(page) {
    localStorage.setItem("lastVisited", page);
  }

  public getTimer() {
    const timer = JSON.parse(localStorage.getItem('timer'));
    if (!(timer === undefined || timer === null || timer === 'undefined' || timer === 'null' || timer === '')) {
      return timer;
    }
    return null;
  }

  public setTimer(timer) {
    localStorage.setItem("timer", JSON.stringify(timer));
  }

  public getStartedTime() {
    return this.getFromLocalStorage("startedTime");
  }

  public setStartedTime(time) {
    localStorage.setItem("startedTime", time);
  }

  private getFromLocalStorage(item) {
    const value = localStorage.getItem(item);
    if (!(value === undefined || value === null || value === 'undefined' || value === 'null' || value === '')) {
      return value;
    }
    return null;
  }
}
