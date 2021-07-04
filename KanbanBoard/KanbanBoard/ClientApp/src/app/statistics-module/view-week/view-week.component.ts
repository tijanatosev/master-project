import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarView } from "angular-calendar";
import { BoardService } from "../../shared/services/board/board.service";
import { ActivatedRoute, Params } from "@angular/router";
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
  public boardId: number;
  public refresh: Subject<any> = new Subject();

  constructor(private boardService: BoardService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = +params['id'];
    });
  }
}
