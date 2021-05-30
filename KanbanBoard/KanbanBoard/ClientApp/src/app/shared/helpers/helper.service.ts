import { Injectable } from '@angular/core';
import { MailService } from "../services/mail/mail.service";
import { Email } from "../services/mail/mail.model";
import { User } from "../services/user/user.model";
import { NotificationService } from "../services/notification/notification.service";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private mailService: MailService,
              private notificationService: NotificationService) {
  }

  listenOnComment(currentUser: User, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification.OnComment && currentUser.Id != assignedToUser.Id) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = "Ticket #" + ticketId + " | " + ticketTitle;
        email.Content = "User commented on ticket assigned to you.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnCommentMine(currentUser: User, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification.OnCommentMine && currentUser.Id != assignedToUser.Id) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = "Ticket #" + ticketId + " | " + ticketTitle;
        email.Content = "User commented on yours' ticket.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnStatusChangeMine(previousStatus: number, currentStatus: number, creator: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification.OnStatusChangeMine && previousStatus != currentStatus) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = "Ticket #" + ticketId + " | " + ticketTitle;
        email.Content = "Ticket changed status.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnStatusChange(previousStatus: number, currentStatus: number, assignedToUser: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(assignedToUser.Id).subscribe(notification => {
      if (notification.OnStatusChange && previousStatus != currentStatus) {
        let email = new Email();
        email.To = assignedToUser.Email;
        email.Cc = "";
        email.Subject = "Ticket #" + ticketId + " | " + ticketTitle;
        email.Content = "Ticket changed status.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }

  listenOnChange(changeCondition: boolean, creator: User, ticketId: number, ticketTitle: string) {
    this.notificationService.getNotificationByUserId(creator.Id).subscribe(notification => {
      if (notification.OnChange && changeCondition) {
        let email = new Email();
        email.To = creator.Email;
        email.Cc = "";
        email.Subject = "Ticket #" + ticketId + " | " + ticketTitle;
        email.Content = "Ticket was changed.";
        this.mailService.sendMail(email).subscribe();
      }
    });
  }
}
