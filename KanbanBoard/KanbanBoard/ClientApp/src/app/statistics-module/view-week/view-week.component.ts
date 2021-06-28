import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarEventTimesChangedEvent, CalendarView } from "angular-calendar";
import { CalendarEvent } from "calendar-utils";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { BoardService } from "../../shared/services/board/board.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ColumnService } from "../../shared/services/column/column.service";
import { Subject } from "rxjs";

@Component({
  selector: 'app-view-week',
  templateUrl: './view-week.component.html',
  styleUrls: ['./view-week.component.css']
})
export class ViewWeekComponent implements OnInit {
  public viewDate: Date;
  public locale: string = 'en';
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  public view: CalendarView = CalendarView.Week;
  public events: CalendarEvent[] = [];
  private boardId: number;
  private tickets: Ticket[] = [];
  private doneColumnId: number;
  public refresh: Subject<any> = new Subject();

  constructor(private boardService: BoardService,
              private route: ActivatedRoute,
              private ticketService: TicketService,
              private columnService: ColumnService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = +params['id'];
    });
    this.ticketService.getTicketsByBoardId(this.boardId).subscribe(tickets => {
      this.tickets = tickets;
      this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => {
        this.doneColumnId = columns.find(x => x.IsDone == true).Id;
        this.createEvents();
      });
    });
  }

  private createEvents() {
    this.events = [];
    for (let i = 0; i < this.tickets.length; i++) {
      this.events.push({
        title: this.tickets[i].Title,
        start: new Date(this.tickets[i].StartDate),
        end: new Date(this.tickets[i].EndDate),
        color: {
          primary: this.getPrimaryColor(this.tickets[i].Priority),
          secondary: this.getPrimaryColor(this.tickets[i].Priority)
        },
        allDay: true,
        draggable: true,
        id: this.tickets[i].Id,
        actions: [
          {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.router.navigate(["ticket", event.id]);
            },
          },
        ],
      });
    }
  }

  public getPrimaryColor(priority) {
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

  public eventTimesChanged({event, newStart, newEnd }: CalendarEventTimesChangedEvent) {
    event.start = newStart;
    event.end = newEnd;
    this.ticketService.updateStartDate(event.id, newStart).subscribe();
    this.ticketService.updateEndDate(event.id, newEnd).subscribe();
    this.refresh.next();
  }
}
