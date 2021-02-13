import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Notification } from "./notification.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.notificationsUrl()}`);
  }

  public getNotification(id) {
    return this.http.get<Notification>(`${this.notificationsUrl()}/${id}`);
  }

  public getNotificationByUserId(userId) {
    return this.http.get<Notification>(`${this.notificationsUrl()}/user/${userId}`);
  }

  public addNotification(notification) {
    return this.http.post(`${this.notificationsUrl()}`, notification, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public updateNotification(id, notification) {
    return this.http.put(`${this.notificationsUrl()}/${id}`, notification, { observe: "response" })
      .pipe(map(response => response.status));
  }
}
