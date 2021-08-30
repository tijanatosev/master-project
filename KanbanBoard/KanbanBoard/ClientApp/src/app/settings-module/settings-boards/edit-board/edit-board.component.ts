import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from "../../../shared/services/board/board.model";
import { BoardService } from "../../../shared/services/board/board.service";
import { TeamService } from "../../../shared/services/team/team.service";
import { UserService } from "../../../shared/services/user/user.service";
import { User } from "../../../shared/services/user/user.model";
import { Team } from "../../../shared/services/team/team.model";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ColumnService } from "../../../shared/services/column/column.service";
import { Column } from "../../../shared/services/column/column.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Responses } from "../../../shared/enums";
import { SnackBarService } from "../../../shared/snack-bar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../../../shared/auth/auth.service";
import {RenameColumnComponent} from "./rename-column/rename-column.component";

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.css']
})
export class EditBoardComponent implements OnInit {
  @Input() board: Board;
  @Output() back = new EventEmitter<boolean>();

  public teams: Team[] = [];
  public users: User[] = [];
  public columns: Column[] = [];
  public boardForm: FormGroup;
  public confirmDialogRef: MatDialogRef<any>;
  public showAddColumn: boolean = false;
  public columnForm: FormGroup;
  public selected = -1;
  public doneColumnForm: FormGroup;
  private defaultWorkTime = 25;
  private defaultBreakTime = 5;
  private defaultIterations = 4;
  private defaultLongerBreak = 30;
  public renameDialogRef: MatDialogRef<any>;

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private userService: UserService,
              private columnService: ColumnService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              private confirmDialog: MatDialog,
              private authService: AuthService,
              private renameDialog: MatDialog) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
    this.userService.getUsers().subscribe(users => this.users = users);
    this.loadColumns();
    this.initForms();
  }

  public drop(event: CdkDragDrop<Column[], any>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  public removeColumn(index) {
    this.columnService.deleteColumn(this.columns[index].Id).subscribe(() => this.columns.splice(index, 1));
  }

  public save(boardForm) {
    let board = new Board();
    board.Id = this.board.Id;
    board.Name = boardForm.value.name;
    board.Admin = boardForm.value.admin;
    board.TeamId = boardForm.value.team;
    board.IsPomodoro = boardForm.value.isPomodoro;
    board.WorkTime = board.IsPomodoro ? boardForm.value.workTime : this.defaultWorkTime;
    board.BreakTime = board.IsPomodoro ? boardForm.value.breakTime : this.defaultBreakTime;
    board.Iterations = board.IsPomodoro ? boardForm.value.iterations : this.defaultIterations;
    board.LongerBreak = board.IsPomodoro ? boardForm.value.longerBreak : this.defaultLongerBreak;
    this.boardService.updateBoard(this.board.Id, board).subscribe(result => {
      if (result == Responses.Successful) {
        this.snackBarService.successful();
        this.goBack();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
    for (let i = 0; i < this.columns.length; i++) {
      this.columnService.updateColumnOrder(this.columns[i].Id, i + 1).subscribe(result => {
        if (result != Responses.Successful) {
          this.snackBarService.unsuccessful();
        }
      });
    }
  }

  public goBack() {
    this.back.emit(true);
  }

  public openRemoveDialog() {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent);
    this.confirmDialogRef.componentInstance.message = "Are you sure you want to permanently delete label " + name + "?";
    this.confirmDialogRef.componentInstance.confirmText = "Yes";
    this.confirmDialogRef.componentInstance.cancelText = "No";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columnService.deleteColumnsByBoardId(this.board.Id).subscribe(() => this.columns = []);
      }
    });
  }

  public openEditColumn(columnId, columnName) {
    this.renameDialogRef = this.renameDialog.open(RenameColumnComponent, {
      width: '430px',
      height: '320px'
    });
    this.renameDialogRef.componentInstance.id = columnId;
    this.renameDialogRef.componentInstance.boardId = this.board.Id;
    this.renameDialogRef.componentInstance.name = columnName;

    this.renameDialogRef.afterClosed().subscribe(result => {
      this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => this.columns = columns);
    });

  }

  public addColumn(columnForm) {
    let column = new Column();
    column.Name = columnForm.value.columnName;
    column.BoardId = this.board.Id;
    column.ColumnOrder = this.columns.length + 1;
    column.IsDone = false;
    this.columnService.addColumn(column).subscribe(columnId => {
      if (columnId > 0) {
        this.showAddColumn = false;
        this.loadColumns();
        this.columnForm.reset();
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public closeAddColumn() {
    this.showAddColumn = false;
    this.columnForm.reset();
  }

  public isDone(id) {
    this.columnService.updateIsDone(id, this.board.Id).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public checkIfTimerIsRunning() {
    let timer = this.authService.getTimer();
    return timer != null && timer.boardId == this.board.Id;
  }

  private loadColumns() {
    this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => {
      this.columns = columns;
      this.columns.sort((a: Column, b: Column) => a.ColumnOrder - b.ColumnOrder);
      let index = columns.findIndex(c => c.IsDone == true);
      if (index != -1) {
        this.selected = columns[index].Id;
        this.doneColumnForm.controls.doneColumn.setValue(this.selected);
      }
    });
  }

  private initForms() {
    this.boardForm = this.formBuilder.group({
      name: [this.board.Name, { validators: [Validators.maxLength(20), Validators.required], updateOn: "blur" }],
      admin: [this.board.Admin, { validators: [Validators.required] }],
      team: [this.board.TeamId, { validators: [Validators.required] }],
      isPomodoro: [this.board.IsPomodoro],
      workTime: [this.board.WorkTime],
      breakTime: [this.board.BreakTime],
      iterations: [this.board.Iterations],
      longerBreak: [this.board.LongerBreak]
    }, {
      validators: [this.validateName()]
    });
    this.columnForm = this.formBuilder.group({
      columnName: ['', { validators: [Validators.maxLength(32)] }]
    },  {
      validators: [this.validateColumnName()]
    });
    this.doneColumnForm = this.formBuilder.group({
      doneColumn: [this.selected, {validators: [this.validateDone()] }]
    });
  }

  private validateName() {
    return (control: AbstractControl) => {
      return control.value.name.length != 0 && control.value.name.trim().length == 0 ?
        this.boardForm.controls.name.setErrors({'nameInvalid': true}) : null
    };
  }

  private validateColumnName() {
    return (control: AbstractControl) => {
      return control.value.columnName && control.value.columnName.length != 0 && control.value.columnName.trim().length == 0 ?
        this.columnForm.controls.columnName.setErrors({'nameInvalid': true}) : null
    };
  }

  public validateDone() {
    return (control: FormControl) => {
      return (control.value == -1) ? { 'doneInvalid': true } : null;
    };
  }
}
