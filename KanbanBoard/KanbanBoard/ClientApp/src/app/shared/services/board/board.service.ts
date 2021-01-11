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

  public addBoard(data) {
    return this.http.post(`${this.boardsUrl()}`, data, { observe: "response" })
      .pipe(map(response => response.status));
  }

  public deleteBoard(id) : Observable<any> {
    return this.http.delete(`${this.boardsUrl()}/${id}`);
  }
}
