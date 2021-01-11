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
}
