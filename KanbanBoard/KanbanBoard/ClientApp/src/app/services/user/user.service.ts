import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { User } from './user.model';
import {catchError, map} from 'rxjs/operators';
import {Service} from '../service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Service {

  constructor(private http: HttpClient) {
    super();
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl());
  }
}
