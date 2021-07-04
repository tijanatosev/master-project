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

  public deleteTicket(id) {
    return this.http.delete(`${this.ticketsUrl()}/${id}`);
  }

  public getTicketsByUserId(userId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/assigned/${userId}`);
  }

  public getTicketsByTeamId(teamId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/team/${teamId}`);
  }

  public getTicketsByBoardId(boardId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/board/${boardId}`);
  }

  public getTicketsByColumnId(columnId, filter) {
    if (filter != "") {
      return this.http.get<Ticket[]>(`${this.ticketsUrl()}/column/${columnId}?${filter}`);
    }
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

  public updateAssignedTo(id, userId) {
    return this.http.put(`${this.ticketsUrl()}/${id}/assignedTo`, userId,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateStartDate(id, startDate) {
    return this.http.put(`${this.ticketsUrl()}/${id}/startDate`, startDate,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateEndDate(id, endDate) {
    return this.http.put(`${this.ticketsUrl()}/${id}/endDate`, endDate,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateStoryPoints(id, storyPoints) {
    return this.http.put(`${this.ticketsUrl()}/${id}/storyPoints`, storyPoints,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateTitle(id, title) {
    return this.http.put(`${this.ticketsUrl()}/${id}/title`, title,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public updateDescription(id, description) {
    return this.http.put(`${this.ticketsUrl()}/${id}/description`, description,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public getFavoritesByUserId(userId) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/favorites/${userId}`);
  }

  public updatePriority(id, priority) {
    return this.http.put(`${this.ticketsUrl()}/${id}/priority`, priority,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public getRankForColumn(columnId, boardId) {
    return this.http.get<number>(`${this.ticketsUrl()}/${columnId}/rank/${boardId}`);
  }

  public getDependency(id) {
    return this.http.get<Ticket[]>(`${this.ticketsUrl()}/${id}/dependency`);
  }

  public addDependency(id, dependencyId) {
    return this.http.post(`${this.ticketsUrl()}/${id}/dependency`, dependencyId, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteDependency(id, dependencyId) {
    return this.http.delete(`${this.ticketsUrl()}/${id}/dependency/${dependencyId}`);
  }
}
