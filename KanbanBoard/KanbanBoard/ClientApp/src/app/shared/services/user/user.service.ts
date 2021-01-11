import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { BaseService } from '../base-service.service';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl()}`);
  }

  public addUser(data) {
    return this.http.post(`${this.usersUrl()}`, data, { observe: "response" })
      .pipe(map(response => response.status));
  }

  public getByUsername(username) {
    return this.http.get<User>(`${this.usersUrl()}/username/${username}`);
  }

  public deleteUser(id) : Observable<any> {
    return this.http.delete(`${this.usersUrl()}/${id}`);
  }
}
