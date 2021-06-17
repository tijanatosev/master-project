import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Comment } from "./comment.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  public getCommentsByTicketId(ticketId) {
    return this.http.get<Comment[]>(`${this.commentsUrl()}/ticket/${ticketId}`);
  }

  public addComment(comment, ticketId) {
    return this.http.post(`${this.commentsUrl()}/ticket/${ticketId}`, comment, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public updateComment(id, text) {
    return this.http.put(`${this.commentsUrl()}/${id}`, text,{ observe: "response" })
      .pipe(map(response => response.status));
  }

  public deleteComment(id) {
    return this.http.delete(`${this.commentsUrl()}/${id}`);
  }
}
