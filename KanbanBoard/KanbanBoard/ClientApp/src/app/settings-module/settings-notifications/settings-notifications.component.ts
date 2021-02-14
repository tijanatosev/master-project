import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { NotificationService } from "../../shared/services/notification/notification.service";
import { Notification } from "../../shared/services/notification/notification.model";
import { AuthService } from "../../shared/auth/auth.service";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.component.html',
  styleUrls: ['./settings-notifications.component.css']
})
export class SettingsNotificationsComponent implements OnInit {
  notificationsForm: FormGroup;
  private notification: Notification;
  private userId: number;
  private notificationId: number;
  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private authService: AuthService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.notificationsForm = this.formBuilder.group({
      onCommentMine: [false],
      onComment: [false],
      onChange: [false],
      onStatusChangeMine: [false],
      onStatusChange: [false]
    });
    this.userId = this.authService.getUserIdFromToken();
    this.notificationService.getNotificationByUserId(this.userId).subscribe(notification => {
      if (notification != null) {
        this.notificationId = notification.Id;
        this.notificationsForm = this.formBuilder.group({
          onCommentMine: [notification.OnCommentMine],
          onComment: [notification.OnComment],
          onChange: [notification.OnChange],
          onStatusChangeMine: [notification.OnStatusChangeMine],
          onStatusChange: [notification.OnStatusChange]
        });
      } else {
        this.notificationId = 0;

      }
    });
  }

  save(data) {
    this.notification = new Notification();
    this.notification.OnChange = data.value.onChange;
    this.notification.OnComment = data.value.onComment;
    this.notification.OnCommentMine = data.value.onCommentMine;
    this.notification.OnStatusChange = data.value.onStatusChange;
    this.notification.OnStatusChangeMine = data.value.onStatusChangeMine;
    this.notification.UserId = this.userId;
    if (this.notificationId > 0) {
      this.notification.Id = this.notificationId;
      this.notificationService.updateNotification(this.notificationId, this.notification).subscribe(result => {
        if (result == Responses.NoContent) {
          this.snackBarService.successful();
        } else {
          this.snackBarService.unsuccessful();
        }
      });
    } else {
      this.notificationService.addNotification(this.notification).subscribe(result => {
        console.log(result);
        if (result != 0) {
          if (typeof result === "number") {
            this.notificationId = result;
          }
          this.snackBarService.successful();
        } else {
          this.snackBarService.unsuccessful();
        }
      });
    }
  }
}
