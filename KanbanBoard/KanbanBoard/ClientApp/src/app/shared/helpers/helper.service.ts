import { Injectable } from '@angular/core';
import { MailService } from "../services/mail/mail.service";
import { Email } from "../services/mail/mail.model";
import { User } from "../services/user/user.model";
import { NotificationService } from "../services/notification/notification.service";
import { ColumnService } from "../services/column/column.service";
import { Column } from "../services/column/column.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private statuses: Column[] = [];

  constructor(private mailService: MailService,
              private notificationService: NotificationService,
              private columnService: ColumnService,
              private authService: AuthService) {
    this.columnService.getColumns().subscribe(statuses => this.statuses = statuses);
  }

  listenOnComment(currentUser: User, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification && notification.OnComment && currentUser.Id != assignedToUser.Id) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = "User commented on ticket assigned to you.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnCommentMine(currentUser: User, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification && notification.OnCommentMine && currentUser.Id != assignedToUser.Id) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = "User commented on yours' ticket.";
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
      if (notification && notification && notification.OnStatusChange && previousStatus != currentStatus) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = this.createContentChangeStatus(previousStatus, currentStatus);
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnChange(changeCondition: boolean, creator: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification && notification.OnChange && changeCondition) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = this.createTitle(ticketId, ticketTitle);
        email.Content = "Ticket was changed.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  private createTitle(ticketId, ticketTitle) {
    return "Ticket #" + ticketId + " | " + ticketTitle;
  }

  private createContentChangeStatus(previousStatus, currentStatus) {
    let previous = this.statuses.find(x => x.Id == previousStatus).Name;
    let current = this.statuses.find(x => x.Id == currentStatus).Name;
    let date = new Date();
    let time = date.getHours() + `:` + date.getMinutes();

    return `User <b>`+ this.authService.getUsernameFromToken() + `</b> changed status from <b>` + previous + `</b> to <b>` + current + `</b> <i>@` + time + `</i>.`;
  }
}
