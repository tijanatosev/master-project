import { Injectable } from '@angular/core';
import { MailService } from "../services/mail/mail.service";
import { Email } from "../services/mail/mail.model";
import { User } from "../services/user/user.model";
import { NotificationService } from "../services/notification/notification.service";
import { ColumnService } from "../services/column/column.service";
import { Column } from "../services/column/column.model";
import { AuthService } from "../auth/auth.service";
import { ChangeType } from "../enums";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private statuses: Column[] = [];
  private readonly user: string;

  constructor(private mailService: MailService,
              private notificationService: NotificationService,
              private columnService: ColumnService,
              private authService: AuthService) {
    this.columnService.getColumns().subscribe(statuses => this.statuses = statuses);
    this.user = this.authService.getUsernameFromToken();
  }

  listenOnComment(assignedToUser: User, ticketId: number, ticketTitle: string, commentText: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification && notification.OnComment) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = this.createContentComment(ticketTitle, commentText);
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnCommentMine(creator: User, ticketId: number, ticketTitle: string, commentText: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification && notification.OnCommentMine) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = this.createContentComment(ticketTitle, commentText);
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnStatusChangeMine(previousStatus: number, currentStatus: number, creator: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification && notification.OnStatusChangeMine && previousStatus != currentStatus) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = this.createContentChangeStatus(previousStatus, currentStatus);
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnStatusChange(previousStatus: number, currentStatus: number, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification && notification.OnStatusChange && previousStatus != currentStatus) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = this.createContentChangeStatus(previousStatus, currentStatus);
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnChangeMine(changeCondition: boolean, type: ChangeType, creator: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification && notification.OnChangeMine && changeCondition) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = 'User <b>' + this.user + '</b> changed ' + ChangeType[type] + ' @<i>' + this.getTime() + '</i>.';
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnChange(changeCondition: boolean, type: ChangeType, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification && notification.OnChange && changeCondition) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = 'User <b>' + this.user + '</b> changed ' + ChangeType[type] + ' @<i>' + this.getTime() + '</i>.';
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  private getTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (hours <= 9 && hours >= 0 ? '0' + hours : hours) + ':' + (minutes <= 9 && minutes >= 0 ? ('0' + minutes) : minutes);
  }

  private createTitle(ticketId, ticketTitle) {
    return "Ticket #" + ticketId + " | " + ticketTitle;
  }

  private createContentChangeStatus(previousStatus, currentStatus) {
    let previous = this.statuses.find(x => x.Id == previousStatus).Name;
    let current = this.statuses.find(x => x.Id == currentStatus).Name;

    return 'User <b>' + this.user + '</b> changed status from <b>' + previous + '</b> to <b>' + current + '</b> <i>@' + this.getTime() + '</i>.';
  }

  private createContentComment(ticketTitle, commentText) {
    return 'User <b>' + this.user + '</b> commented on ticket <b>' + ticketTitle + '</b> <i>@' + this.getTime() + '</i>: \n\n <b><pre>' + commentText + '</pre></b>';
  }
}
