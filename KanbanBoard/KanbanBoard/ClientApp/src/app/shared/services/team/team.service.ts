import { Injectable } from '@angular/core';
import { Service } from '../service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './team.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends Service {

  constructor(private http: HttpClient) {
    super();
  }

  public getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.teamsUrl()}`);
  }

  public addTeam(data) {
    return this.http.post(`${this.teamsUrl()}`, data, { observe: "response" })
      .pipe(map(response => response.status));
  }

  public deleteTeam(id) : Observable<any> {
    return this.http.delete(`${this.teamsUrl()}/${id}`);
  }
}