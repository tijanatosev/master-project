import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from './board.model';
import { BaseService } from '../base-service.service';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BoardService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.boardsUrl()}`);
  }

  public getBoard(id) {
    return this.http.get<Board>(`${this.boardsUrl()}/${id}`);
  }

  public addBoard(board) {
    return this.http.post(`${this.boardsUrl()}`, board, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteBoard(id) : Observable<any> {
    return this.http.delete(`${this.boardsUrl()}/${id}`);
  }

  public getBoardsByUserId(userId): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.boardsUrl()}/user/${userId}`);
  }

  public getBoardsByTeamId(teamId): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.boardsUrl()}/team/${teamId}`);
  }

  public updateBoard(id, board) {
    return this.http.put(`${this.boardsUrl()}/${id}`, board, { observe: "response"})
      .pipe(map(response => response.status));
  }
}
