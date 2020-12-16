import { Injectable } from '@angular/core';
import { Service } from '../service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends Service {

  constructor(private http: HttpClient) {
    super();
  }

  public getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsUrl());
  }

  public addTeam(data) {
    let httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Team>(this.teamsUrl(), JSON.stringify(data), httpHeaders);
  }
}
