import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { ColumnService } from "../../shared/services/column/column.service";
import { Column } from "../../shared/services/column/column.model";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";
import { HelperService } from "../../shared/helpers/helper.service";
import { UserService } from "../../shared/services/user/user.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddTicketComponent } from "../../ticket-module/add-ticket/add-ticket.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  public boardId: number;
  public board: Board;
  public tickets: Ticket[] = [];
  public columns: Column[] = [];
  public dialogTicketRef: MatDialogRef<any>;

  constructor(private route: ActivatedRoute,
              private boardService: BoardService,
              private ticketService: TicketService,
              private columnService: ColumnService,
              private snackBarService: SnackBarService,
              private helperService: HelperService,
              private userService: UserService,
              private ticketDialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = +params['id'];
    });
    this.boardService.getBoard(this.boardId).subscribe(board => {
      this.board = board;
      this.ticketService.getTicketsByTeamId(this.board.TeamId).subscribe(tickets => this.tickets = tickets);
    });
    this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => this.columns = columns);
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
    this.dialogTicketRef = this.ticketDialog.open(AddTicketComponent, {
      width: '400px',
      height: '600px'
    });

    this.dialogTicketRef.afterClosed().subscribe(result => console.log(result));
  }
}
