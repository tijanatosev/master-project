import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './team.model';
import { map } from "rxjs/operators";
import {Board} from "../board/board.model";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.teamsUrl()}`);
  }

  public addTeam(team) {
    return this.http.post(`${this.teamsUrl()}`, team, { observe: "response" })
      .pipe(map(response => response.status));
  }

  public deleteTeam(id) : Observable<any> {
    return this.http.delete(`${this.teamsUrl()}/${id}`);
  }

  public getTeamsByUserId(userId): Observable<Board[]> {
    return this.http.get<Team[]>(`${this.teamsUrl()}/user/${userId}`);
  }
}
