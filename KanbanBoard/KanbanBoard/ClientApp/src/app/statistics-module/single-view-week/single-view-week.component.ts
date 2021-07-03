import { Component, Input, OnInit } from '@angular/core';
import { CalendarEventTimesChangedEvent } from "angular-calendar";
import { CalendarEvent } from "calendar-utils";
import { Subject } from "rxjs";
import { TicketService } from "../../shared/services/ticket/ticket.service";

@Component({
  selector: 'app-single-view-week',
  templateUrl: './single-view-week.component.html',
  styleUrls: ['./single-view-week.component.css']
})
export class SingleViewWeekComponent implements OnInit {
  @Input() viewDate: Date;
  @Input() public events: CalendarEvent[] = [];
  @Input() public refresh: Subject<any> = new Subject();

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
  }

  public eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent) {
    event.start = newStart;
    event.end = newEnd;
    this.ticketService.updateStartDate(event.id, newStart).subscribe();
    this.ticketService.updateEndDate(event.id, newEnd).subscribe();
    this.refresh.next();
  }

}
