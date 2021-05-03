import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { LabelService } from "../../shared/services/label/label.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { Label } from "../../shared/services/label/label.model";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";

@Component({
  selector: 'app-board-ticket',
  templateUrl: './board-ticket.component.html',
  styleUrls: ['./board-ticket.component.css']
})
export class BoardTicketComponent implements OnInit {
  @Input() ticketId: number;
  public ticket: Ticket;
  public labels: Label[] = [];
  public initials: string;

  constructor(private ticketService: TicketService,
              private labelService: LabelService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.userService.getUser(ticket.AssignedTo).subscribe(user => {
        this.initials = user.FirstName.substring(0, 1) + user.LastName.substring(0, 1);
      });
    });
    this.labelService.getLabelsByTicketId(this.ticketId).subscribe(labels => this.labels = labels.slice(0, 5));
  }

  public goToTicket() {
    this.router.navigate(["ticket", this.ticketId]);
  }
}
