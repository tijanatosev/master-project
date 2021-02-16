import { Component, OnInit } from '@angular/core';
import { Ticket} from "../../shared/services/ticket/ticket.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  ticketForm;
  public ticket: Ticket;
  public ticketId: number;
  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => this.ticket = ticket);
    this.ticketForm = this.formBuilder.group({
      title: [''],
      description: ['']
    });
  }

}
