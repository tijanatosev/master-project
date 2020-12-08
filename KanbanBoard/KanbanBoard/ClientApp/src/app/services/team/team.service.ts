import { Injectable } from '@angular/core';
import { Service } from '../service.service';
import { HttpClient } from '@angular/common/http';
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
}
