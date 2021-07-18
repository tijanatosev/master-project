import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarEventTimesChangedEvent } from "angular-calendar";
import { CalendarEvent } from "calendar-utils";
import { Subject } from "rxjs";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-single-view-week',
  templateUrl: './single-view-week.component.html',
  styleUrls: ['./single-view-week.component.css']
})
export class SingleViewWeekComponent implements OnInit, OnChanges {
  @Input() viewDate: Date;
  @Input()
  get boardId(): number {
    return this._boardId;
  }
  set boardId(boardId: number) {
    this._boardId = boardId;
  }
  @Input() refresh: Subject<any>;
  @Input() usePriorityColors: boolean;
  @Input() primaryColor: string;
  @Input() secondaryColor: string;
  private _boardId: number;
  public events: CalendarEvent[] = [];
  private tickets: Ticket[] = [];

  constructor(private ticketService: TicketService,
              private router: Router) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["boardId"]) {
      this.ticketService.getTicketsByBoardId(this.boardId).subscribe(tickets => {
        this.tickets = tickets;
        this.createEvents();
      });
    }
  }

  public eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent) {
    event.start = newStart;
    event.end = newEnd;
    this.ticketService.updateStartDate(event.id, newStart).subscribe();
    this.ticketService.updateEndDate(event.id, newEnd).subscribe();
    this.refresh.next();
  }

  private createEvents() {
    this.events = [];
    for (let i = 0; i < this.tickets.length; i++) {
      this.events.push({
        title: this.tickets[i].Title,
        start: new Date(this.tickets[i].StartDate),
        end: new Date(this.tickets[i].EndDate),
        color: {
          primary: this.usePriorityColors ? this.getPriorityColor(this.tickets[i].Priority) : this.primaryColor,
          secondary: this.usePriorityColors ? this.getPriorityColor(this.tickets[i].Priority) : this.secondaryColor
        },
        allDay: true,
        draggable: true,
        id: this.tickets[i].Id,
        actions: [
          {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.router.navigate(["task", event.id]);
            },
          },
        ],
      });
    }
  }

  private getPriorityColor(priority) {
    switch (priority) {
      case 1:
        return "skyblue"
      case 2:
        return "dodgerblue";
      case 3:
        return "orange";
      case 4:
        return "orangered";
      case 5:
        return "darkred";
    }
  }

}
