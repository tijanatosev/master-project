import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from "../../../shared/services/board/board.model";
import { BoardService } from "../../../shared/services/board/board.service";
import { TeamService } from "../../../shared/services/team/team.service";
import { UserService } from "../../../shared/services/user/user.service";
import { User } from "../../../shared/services/user/user.model";
import { Team } from "../../../shared/services/team/team.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ColumnService } from "../../../shared/services/column/column.service";
import { Column } from "../../../shared/services/column/column.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Responses } from "../../../shared/enums";
import { SnackBarService } from "../../../shared/snack-bar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../../shared/confirmation-dialog/confirmation-dialog.component";

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

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private userService: UserService,
              private columnService: ColumnService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              private confirmDialog: MatDialog) { }

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
    board.TeamId = boardForm.value.team == undefined ? null : boardForm.value.team;
    this.boardService.updateBoard(this.board.Id, board).subscribe(result => {
      if (result == Responses.Successful) {
        this.snackBarService.successful();
        this.goBack();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
    for (let i = 0; i < this.columns.length; i++) {
      this.columnService.updateColumnOrder(this.columns[i].Id, i+1).subscribe(result => {
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

  public addColumn(columnForm) {
    let column = new Column();
    column.Name = columnForm.value.columnName;
    column.BoardId = this.board.Id;
    column.ColumnOrder = this.columns.length + 1;
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

  private loadColumns() {
    this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => {
      this.columns = columns;
      this.columns.sort((a: Column, b: Column) => a.ColumnOrder - b.ColumnOrder);
    });
  }

  private initForms() {
    this.boardForm = this.formBuilder.group({
      name: [this.board.Name, { validators: [Validators.maxLength(20)], updateOn: "blur" }],
      admin: [this.board.Admin],
      team: [this.board.TeamId]
    });
    this.columnForm = this.formBuilder.group({
      columnName: ['', { validators: [Validators.maxLength(32)] }]
    });
  }

}
