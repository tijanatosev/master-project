import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { ColumnService } from "../../shared/services/column/column.service";
import { Label } from "ng2-charts";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { LabelService } from "../../shared/services/label/label.service";
import { BoardService } from "../../shared/services/board/board.service";
import { TicketService } from "../../shared/services/ticket/ticket.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  private boardId: number;
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { xAxes: [{ }], yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1
        },
      }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public ticketsPerColumnLabels: Label[] = [];
  public ticketsPerLabelLabels: Label[] = [];
  public chartType: ChartType = 'bar';
  public chartLegend = true;
  public ticketsPerColumnData: ChartDataSets[] = [{
    label: 'Tickets per column',
    data: []
  }];
  public ticketsPerLabelData: ChartDataSets[] = [{
    label: 'Tickets per label',
    data: []
  }];

  public burnup: ChartDataSets[] = [{
    label: 'Burnup chart',
    data: []
  }];

  public data = [];

  public chartOption = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM D', // This is the default
            },
          },
        },
      ]
    }
  }

  constructor(private route: ActivatedRoute,
              private columnService: ColumnService,
              private labelService: LabelService,
              private boardService: BoardService,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = +params['id'];
    });

    this.boardService.getNumberOfTicketsPerColumn(this.boardId).subscribe(values => {
      this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => {
        columns.forEach(column => {
          this.ticketsPerColumnLabels.push(column.Name);
          this.ticketsPerColumnData[0].data.push(values[column.Name]);
        });
      });
    });

    this.boardService.getNumberOfTicketsPerLabel(this.boardId).subscribe(values => {
      this.labelService.getLabelsByBoardId(this.boardId).subscribe(labels => {
        labels.forEach(label => {
          this.ticketsPerLabelLabels.push(label.Name);
          this.ticketsPerLabelData[0].data.push(values[label.Name]);
        });
      });
    });

    this.ticketService.getTicketsByBoardId(this.boardId).subscribe(tickets => {
      console.log(this.data);
      this.data.push({
        x: new Date(tickets.filter(x => x.CompletedAt != null).sort((x, y) => {
          if (x.StartDate != undefined && y.StartDate != undefined) {
            return new Date(x.StartDate).getTime() - new Date(y.StartDate).getTime();
          }
        })[0].StartDate),
        y: 0
      });
      tickets.sort((a,b) => new Date(a.CompletedAt).getTime() - new Date(b.CompletedAt).getTime() ).forEach(t => {
        this.data.push({
          x: t.CompletedAt == null ? new Date(t.StartDate) : new Date(t.CompletedAt),
          y: t.StoryPoints
        });
      });
      this.data.push({
        x: new Date(tickets.filter(x => x.CompletedAt != null).sort((x, y) => {
          if (x.EndDate != undefined && y.EndDate != undefined) {
            return new Date(x.EndDate).getTime() - new Date(y.EndDate).getTime();
          }
        })[0].EndDate),
        y: 100
      });
      console.log(this.burnup);
      console.log(this.data);
    });
  }

}
