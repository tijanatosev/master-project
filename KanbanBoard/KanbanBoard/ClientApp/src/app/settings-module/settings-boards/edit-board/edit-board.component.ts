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
  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private userService: UserService,
              private columnService: ColumnService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
    this.userService.getUsers().subscribe(users => this.users = users);
    this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => {
      this.columns = columns;
      this.columns.sort((a, b) => a.ColumnOrder - b.ColumnOrder);
    });
    this.boardForm = this.formBuilder.group({
      name: ['', { validators: [Validators.maxLength(20)], updateOn: "blur" }],
      admin: [this.board.Admin],
      team: [this.board.TeamId]
    });
  }

  public drop(event: CdkDragDrop<Column[], any>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  public save() {
    for (var i = 0; i < this.columns.length; i++) {
      this.columnService.updateColumnOrder(this.columns[i].Id, i+1).subscribe(result => {
        if (result != Responses.NoContent) {
          this.snackBarService.unsuccessful();
        }
      });
    }
  }

  public goBack() {
    this.back.emit(true);
  }

}
