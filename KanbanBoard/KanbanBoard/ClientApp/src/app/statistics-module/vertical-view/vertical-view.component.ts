import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from "@angular/forms";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { CalendarView } from "angular-calendar";
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
  public firstBoardId: number = 0;
  public secondBoardId: number = 0;
  public thirdBoardId: number = 0;
  public refresh: Subject<any> = new Subject();
  public primaryColorFirstBoard: string = "LightCoral";
  public secondaryColorFirstBoard: string = "LightCoral";
  public primaryColorSecondBoard: string = "Teal";
  public secondaryColorSecondBoard: string = "Teal";
  public primaryColorThirdBoard: string = "SeaGreen";
  public secondaryColorThirdBoard: string = "SeaGreen";

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
    this.firstBoardId = data.value.firstBoard != null ? data.value.firstBoard : 0;
    this.secondBoardId = data.value.secondBoard != null ? data.value.secondBoard : 0;
    this.thirdBoardId = data.value.thirdBoard != null ? data.value.thirdBoard : 0;
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
