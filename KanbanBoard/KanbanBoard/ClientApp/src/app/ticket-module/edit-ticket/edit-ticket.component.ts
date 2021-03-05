import { Component, OnInit } from '@angular/core';
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { LabelService } from "../../shared/services/label/label.service";
import { Label } from "../../shared/services/label/label.model";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketId: number;
  public assignedTo: string;
  public labels: Label[] = [];
  public removable: boolean = true;
  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private userService: UserService,
              private labelService: LabelService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.userService.getUser(ticket.AssignedTo).subscribe(user => this.assignedTo = user.Username);
    });
    this.loadLabels();
  }

  public remove(labelId) {
    this.labelService.deleteByTicketId(labelId, this.ticketId).subscribe(() => this.loadLabels());
  }

  private loadLabels() {
    this.labelService.getLabelsByTicketId(this.ticketId).subscribe(labels => this.labels = labels);
  }

}
