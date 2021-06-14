import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ColumnService } from "../../shared/services/column/column.service";
import { Column } from "../../shared/services/column/column.model";
import { Priorities, Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";
import { HelperService } from "../../shared/helpers/helper.service";
import { UserService } from "../../shared/services/user/user.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddTicketComponent } from "../../ticket-module/add-ticket/add-ticket.component";
import { User } from "../../shared/services/user/user.model";
import { Label} from "../../shared/services/label/label.model";
import { LabelService } from "../../shared/services/label/label.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  public boardId: number;
  public board: Board;
  public columns: Column[] = [];
  public dialogTicketRef: MatDialogRef<any>;
  public members: User[] = [];
  public labels: Label[] = [];
  public priorities = Priorities;
  public prioritiesValues = Priorities.values();
  public filterForm;
  public filter: string = "";

  constructor(private route: ActivatedRoute,
              private boardService: BoardService,
              private ticketService: TicketService,
              private columnService: ColumnService,
              private snackBarService: SnackBarService,
              private helperService: HelperService,
              private userService: UserService,
              private ticketDialog: MatDialog,
              private labelService: LabelService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = +params['id'];
    });
    this.loadBoard();
    this.filterForm = this.formBuilder.group({
      assignedTo: [""],
      label: [""],
      priority: [""]
    });
  }

  public onChangeColumns(event: number[]) {
    let newColumnOrder = event[0];
    let oldColumnOrder = event[1];
    let ticketId = event[2];
    let previousColumn = this.columns[oldColumnOrder - 1].Id;
    let currentColumn = this.columns[newColumnOrder - 1].Id;

    this.ticketService.updateColumn(ticketId, currentColumn).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
      this.ticketService.getTicket(ticketId).subscribe(ticket => {
        this.userService.getUsers().subscribe(users => {
          let creator = users.find(x => x.Username == ticket.Creator);
          let assignedTo = users.find(x => x.Id == ticket.AssignedTo);
          this.helperService.listenOnStatusChangeMine(previousColumn, currentColumn, creator, ticketId, ticket.Title);
          if (creator.Id != assignedTo.Id) {
            this.helperService.listenOnStatusChangeMine(previousColumn, currentColumn, assignedTo, ticketId, ticket.Title);
          }
        });
      });
    });
  }

  public createTicket() {
    this.dialogTicketRef = this.ticketDialog.open(AddTicketComponent, {});
    this.dialogTicketRef.componentInstance.boardId = this.board.Id;
    this.dialogTicketRef.componentInstance.teamId = this.board.TeamId;

    this.dialogTicketRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoard();
      }
    });
  }

  public emitFilter(data) {
    this.filter = "";
    let assignedTo = data.value.assignedTo;
    let label = data.value.label;
    let priority = data.value.priority;
    if (assignedTo != "" && assignedTo != undefined) {
      this.filter += "$filter=AssignedTo eq " + assignedTo;
    }
    if (label != "" && label != undefined) {
      if (this.filter != "") {
        this.filter += "&";
      }
      this.filter += "$filter=LabelId eq " + label;
    }
    if (priority != "" && priority != undefined) {
      if (this.filter != "") {
        this.filter += "&";
      }
      this.filter += "$filter=Priority eq " + priority;
    }
  }

  private loadBoard() {
    this.boardService.getBoard(this.boardId).subscribe(board => {
      this.board = board;
      this.userService.getUsersByTeamId(this.board.TeamId).subscribe(users => this.members = users);
    });
    this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => this.columns = columns);
    this.labelService.getLabels().subscribe(labels => this.labels = labels);
  }
}
