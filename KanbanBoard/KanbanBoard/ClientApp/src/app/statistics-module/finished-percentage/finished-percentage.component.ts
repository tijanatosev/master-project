import { Component, Input, OnInit } from '@angular/core';
import {TicketService} from "../../shared/services/ticket/ticket.service";
import {ColumnService} from "../../shared/services/column/column.service";
import {SingleDataSet} from "ng2-charts";

@Component({
  selector: 'app-finished-percentage',
  templateUrl: './finished-percentage.component.html',
  styleUrls: ['./finished-percentage.component.css']
})
export class FinishedPercentageComponent implements OnInit {
  @Input() boardId: number;
  @Input() numberOfTickets: number;
  public percentage;
  private doneColumnId: number;
  private doneTickets: number;
  public data: SingleDataSet;
  public chartReady = false;
  public labels = ["completed", "remaining"];

  constructor(private ticketService: TicketService,
              private columnService: ColumnService) { }

  ngOnInit() {
    this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => {
      this.doneColumnId = columns.find(x => x.IsDone == true).Id;
      this.ticketService.getTicketsByColumnId(this.doneColumnId).subscribe(tickets => {
        this.doneTickets = tickets.length;
        this.percentage = (this.doneTickets * 100 / this.numberOfTickets).toFixed(1);
        this.data = [this.doneTickets, this.numberOfTickets - this.doneTickets];
        this.chartReady = true;
      });
    });
  }

}
