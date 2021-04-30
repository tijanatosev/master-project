import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { Board } from "../../../shared/services/board/board.model";
import { TicketService } from "../../../shared/services/ticket/ticket.service";
import {SingleDataSet} from "ng2-charts";
import {ColumnService} from "../../../shared/services/column/column.service";

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {
  @Input() board: Board;
  @Input() isAdmin: boolean;
  @Output() boardDelete = new EventEmitter<Map<string, string>>();
  public numberOfTickets: number;
  public percentage;
  private doneColumnId: number;
  private doneTickets: number;
  public data: SingleDataSet;
  public chartReady = false;

  constructor(private router: Router,
              private ticketService: TicketService,
              private columnService: ColumnService) { }

  ngOnInit() {
    this.ticketService.getTicketsByTeamId(this.board.TeamId).subscribe(tickets => this.numberOfTickets = tickets.length);
    this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => {
      this.doneColumnId = columns.find(x => x.IsDone == true).Id;
      this.ticketService.getTicketsByColumnId(this.doneColumnId).subscribe(tickets => {
        this.doneTickets = tickets.length;
        this.percentage = (this.doneTickets * 100 / this.numberOfTickets).toFixed(1);
        this.data = [this.doneTickets, this.numberOfTickets - this.doneTickets];
        this.chartReady = true;
      });
    });
  }

  public goToBoard(id) {
    this.router.navigate(['board', id]);
  }

  public onBoardDelete(id, name) {
    let values = new Map<string, string>();
    values.set("id", id);
    values.set("name", name);
    this.boardDelete.emit(values);
  }

}
