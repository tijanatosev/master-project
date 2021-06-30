import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Priorities } from "../../shared/enums";
import { UserService } from "../../shared/services/user/user.service";
import { User } from "../../shared/services/user/user.model";
import { ColumnService } from "../../shared/services/column/column.service";
import { Column } from "../../shared/services/column/column.model";
import { LabelService } from "../../shared/services/label/label.service";
import { Label } from "../../shared/services/label/label.model";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { AuthService } from "../../shared/auth/auth.service";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  @Input() boardId: number;
  @Input() teamId: number;
  public ticketForm;
  public members: User[];
  public statuses: Column[];
  public points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  public priorities = Priorities;
  public prioritiesValues = Priorities.values();
  public labels: Label[];
  public minDate = new Date("1/1/1970");
  public maxDate = new Date("1/1/2050");

  constructor(private ticketService: TicketService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private columnService: ColumnService,
              private labelService: LabelService,
              private authService: AuthService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.ticketForm = this.formBuilder.group({
      title: ['', { validators: [Validators.required, Validators.maxLength(128), Validators.nullValidator] }],
      description: ['', {validators: [Validators.required, Validators.maxLength(3000), Validators.nullValidator] }],
      assignedTo: ['', { validators: [Validators.required] }],
      status: ['', { validators: [Validators.required] }],
      storyPoints: ['', { validators: [Validators.required] }],
      priority: ['', { validators: [Validators.required] }],
      startDate: [''],
      endDate: [''],
      labels: ['']
    }, {
      validators: [this.validateStartDateEndDate()]
    });
    this.columnService.getColumnsByBoardId(this.boardId).subscribe(statuses => this.statuses = statuses.filter(x => !x.IsDone));
    this.userService.getUsersByTeamId(this.teamId).subscribe(users => {
      this.members = users;
    });
    this.labelService.getLabels().subscribe(labels => this.labels = labels);
  }

  public save(data) {
    let ticket = new Ticket();
    ticket.Title = data.value.title;
    ticket.Description = data.value.description;
    ticket.AssignedTo = data.value.assignedTo;
    ticket.Creator = this.authService.getUsernameFromToken();
    ticket.Status = data.value.status[0];
    ticket.StoryPoints = data.value.storyPoints;
    ticket.DateCreated = new Date();
    ticket.ColumnId = data.value.status[1];
    ticket.BoardId = this.boardId;
    ticket.StartDate = data.value.startDate == "" ? null : data.value.startDate;
    ticket.EndDate = data.value.endDate == "" ? null : data.value.endDate;
    ticket.Priority = data.value.priority;
    ticket.CompletedAt = null;
    this.ticketService.getRankForColumn(ticket.ColumnId, ticket.BoardId).subscribe(rank => {
      if (rank > -1) {
        ticket.Rank = rank + 1;
        this.ticketService.addTicket(ticket).subscribe(ticketId => {
          if (ticketId > 0) {
            let labels = data.value.labels;
            for (let i = 0; i < labels.length; i++) {
              this.labelService.addLabelByTicketId(labels[i], ticketId).subscribe();
            }
            this.snackBarService.successful();
          } else {
            this.snackBarService.unsuccessful();
          }
        });
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  private validateStartDateEndDate() {
    return (control: AbstractControl) => {
      return control.value.startDate != "" && control.value.endDate != "" && control.value.startDate > control.value.endDate ?
        this.ticketForm.controls.startDate.setErrors({ 'startDateGreaterThanEndDate': true }) : null };
  }
}
