import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { LabelService } from "../../shared/services/label/label.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { Label } from "../../shared/services/label/label.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-board-ticket',
  templateUrl: './board-ticket.component.html',
  styleUrls: ['./board-ticket.component.css']
})
export class BoardTicketComponent implements OnInit {
  @Input() ticketId: number;
  public ticket: Ticket;
  public labels: Label[] = [];

  constructor(private ticketService: TicketService,
              private labelService: LabelService,
              private router: Router) { }

  ngOnInit() {
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => this.ticket = ticket);
    this.labelService.getLabelsByTicketId(this.ticketId).subscribe(labels => this.labels = labels);
  }

  public goToTicket() {
    this.router.navigate(["ticket", this.ticketId]);
  }
}
