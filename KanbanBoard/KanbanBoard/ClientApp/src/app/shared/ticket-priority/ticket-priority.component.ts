import { Component, Input, OnInit } from '@angular/core';
import { Priorities } from "../enums";

@Component({
  selector: 'app-ticket-priority',
  templateUrl: './ticket-priority.component.html',
  styleUrls: ['./ticket-priority.component.css']
})
export class TicketPriorityComponent implements OnInit {
  @Input() priority: number;
  public priorities = Priorities;

  constructor() { }

  ngOnInit() {
  }

}
