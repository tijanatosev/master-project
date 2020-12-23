import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from './board.model';
import { Service } from '../service.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService extends Service {

  constructor(private http: HttpClient) {
    super();
  }

  public getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.boardsUrl()}`);
  }

  public addBoard(data): Observable<Board> {
    return this.http.post<Board>(`${this.boardsUrl()}`, JSON.stringify(data), this.httpHeaders());
  }

  public deleteBoard(id) : Observable<any> {
    return this.http.delete(`${this.boardsUrl()}/${id}`);
  }
}
