import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Label } from "./label.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LabelService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.labelsUrl()}`);
  }

  public getLabel(id): Observable<Label> {
    return this.http.get<Label>(`${this.labelsUrl()}/${id}`);
  }

  public addLabel(label) {
    return this.http.post(`${this.labelsUrl()}`, label, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteLabel(id) {
    return this.http.delete(`${this.labelsUrl()}/${id}`);
  }

  public deleteAllLabels() {
    return this.http.delete(`${this.labelsUrl()}`);
  }

  public getLabelsByTicketId(ticketId) {
    return this.http.get<Label[]>(`${this.labelsUrl()}/tickets/${ticketId}`);
  }

  public deleteByTicketId(labelId, ticketId) {
    return this.http.delete(`${this.labelsUrl()}/${labelId}/tickets/${ticketId}`);
  }

  public addLabelByTicketId(label, ticketId) {
    return this.http.post(`${this.labelsUrl()}/tickets/${ticketId}`, label, { observe: "response" })
      .pipe(map(response => response.body));
  }
}
