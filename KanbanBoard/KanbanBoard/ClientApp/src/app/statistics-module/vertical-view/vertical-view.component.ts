import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from "@angular/forms";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { CalendarView } from "angular-calendar";
import { CalendarEvent } from "calendar-utils";
import { Subject } from "rxjs";

@Component({
  selector: 'app-vertical-view',
  templateUrl: './vertical-view.component.html',
  styleUrls: ['./vertical-view.component.css']
})
export class VerticalViewComponent implements OnInit {
  public boardsForm;
  public boards: Board[] = [];
  public view: CalendarView = CalendarView.Week;
  public viewDate: Date;
  public locale: string = 'en';
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  public events: CalendarEvent[] = [];
  public refresh: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder,
              private boardService: BoardService) { }

  ngOnInit() {
    this.boardsForm = this.formBuilder.group({
      firstBoard: [],
      secondBoard: [],
      thirdBoard: []
    }, {
      validators: [this.validateSelectedBoards()]
    });
    this.boardService.getBoards().subscribe(boards => {
      this.boards = boards;
    });
  }

  public showVerticalView(data) {
  }

  private validateSelectedBoards() {
    return (control: AbstractControl) => {
      if (control.value.firstBoard != undefined && control.value.secondBoard != undefined && control.value.firstBoard == control.value.secondBoard) {
        return this.boardsForm.controls.secondBoard.setErrors({'selectedBoardsMustBeDifferent': true});
      }
      if (control.value.firstBoard != undefined && control.value.thirdBoard != undefined && control.value.firstBoard == control.value.thirdBoard) {
        return this.boardsForm.controls.thirdBoard.setErrors({'selectedBoardsMustBeDifferent': true});
      }
      if (control.value.secondBoard != undefined && control.value.thirdBoard != undefined && control.value.secondBoard == control.value.thirdBoard) {
        return this.boardsForm.controls.thirdBoard.setErrors({'selectedBoardsMustBeDifferent': true});
      }
      return null;
    }
  }

}
