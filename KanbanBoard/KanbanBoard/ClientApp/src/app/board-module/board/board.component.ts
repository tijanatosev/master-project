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

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  public boardId: number;
  public board: Board;
  public tickets: Ticket[];
  public columns: Column[];

  constructor(private route: ActivatedRoute,
              private boardService: BoardService,
              private ticketService: TicketService,
              private columnService: ColumnService,
              private snackBarService: SnackBarService) { }

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
    let columnOrder = event[0];
    let ticketId = event[1];
    this.ticketService.updateColumn(ticketId, this.columns[columnOrder-1].Id).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
    });
  }
}
