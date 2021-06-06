import { Component, OnInit } from '@angular/core';
import { TicketService } from "../../shared/services/ticket/ticket.service";

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {

  public ticketForm;

  constructor(ticketService: TicketService) { }

  ngOnInit() {
  }

  public addTicket(data) {

  }
}
