import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return (!(token === undefined || token === null || token === 'undefined' || token === 'null' || token === ''));
  }

  public setToken(data) {
    localStorage.setItem('token', JSON.stringify(data));
  }

  public login(data) {
    this.loggedIn.next(true);
    this.setToken(data);
  }

  public logout() {
    this.loggedIn.next(false);
    localStorage.setItem('token', undefined);
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

  public getCreated() {
    return this.getFromLocalStorage("created");
  }

  public setCreated(time) {
    localStorage.setItem("created", time);
  }

  public getIterations() {
    return this.getFromLocalStorage("iterations");
  }

  public setIterations(iterations) {
    localStorage.setItem("iterations", iterations);
  }

  private getFromLocalStorage(item) {
    const value = localStorage.getItem(item);
    if (!(value === undefined || value === null || value === 'undefined' || value === 'null' || value === '')) {
      return value;
    }
    return null;
  }
}
