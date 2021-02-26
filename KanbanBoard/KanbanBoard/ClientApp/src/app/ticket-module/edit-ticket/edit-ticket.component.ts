import { Component, OnInit } from '@angular/core';
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketId: number;
  public assignedTo: string;
  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.userService.getUser(ticket.AssignedTo).subscribe(user => this.assignedTo = user.Username);
    });
  }

}
