import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Ticket } from "./ticket.model";

@Injectable({
  providedIn: 'root'
})
export class TicketService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  public getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}`);
  }

  public getTicket(id) {
    return this.http.get<Ticket>(`${this.ticketsUrl()}/${id}`);
  }

  public addTicket(ticket) {
    return this.http.post(`${this.ticketsUrl()}`, ticket, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteTicket(id) : Observable<any> {
    return this.http.delete(`${this.ticketsUrl()}/${id}`);
  }

  public getTicketsByUserId(userId): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/assigned/${userId}`);
  }

  public getTicketsByTeamId(teamId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/team/${teamId}`);
  }

  public getTicketsByColumnId(columnId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/column/${columnId}`);
  }

  public updateColumn(id, columnId) {
    return this.http.put(`${this.ticketsUrl()}/${id}/column`, columnId,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateRank(id, rank) {
    return this.http.put(`${this.ticketsUrl()}/${id}/rank`, rank,{ observe: "response" })
      .pipe(map(response => response.status));
  }
}
