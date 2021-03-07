import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { Column } from "./column.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ColumnService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getColumn(id) {
    return this.http.get<Column>(`${this.columnsUrl()}/${id}`);
  }

  public getColumnsByBoardId(boardId) {
    return this.http.get<Column[]>(`${this.columnsUrl()}/boards/${boardId}`);
  }

  public addColumn(column) {
    return this.http.post(`${this.columnsUrl()}`, column, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteColumn(id) {
    return this.http.delete(`${this.columnsUrl()}/${id}`);
  }

  public updateColumnOrder(id, columnOrder) {
    return this.http.put(`${this.columnsUrl()}/${id}/order`, columnOrder,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public deleteColumnsByBoardId(boardId) {
    return this.http.delete(`${this.columnsUrl()}/boards/${boardId}`);
  }
}