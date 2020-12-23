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
    return this.http.get<Team[]>(`${this.teamsUrl()}`);
  }

  public addTeam(data): Observable<Team> {
    return this.http.post<Team>(`${this.teamsUrl()}`, JSON.stringify(data), this.httpHeaders());
  }

  public deleteTeam(id) : Observable<any> {
    return this.http.delete(`${this.teamsUrl()}/${id}`);
  }
}
