import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { ColumnService } from "../../shared/services/column/column.service";
import { Label } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { LabelService } from "../../shared/services/label/label.service";
import { BoardService } from "../../shared/services/board/board.service";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  private boardId: number;
  public optionsForBarChart: ChartOptions = {
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
  public optionsForLineChart: ChartOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        ticks: {
          stepSize: 1,
          autoSkip: true,
          maxTicksLimit: 15
        },
        time: {
          unit: 'day',
          unitStepSize: 30,
          displayFormats: { day: 'MMM D' },
        },
      }]
    }
  };
  public optionsForPieChart: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return ctx.chart.data.labels[ctx.dataIndex]
        },
      },
    }
  };
  public ticketsPerColumnLabels: Label[] = [];
  public ticketsPerLabelLabels: Label[] = [];
  public ticketsPerColumnData: ChartDataSets[] = [{
    label: 'Tickets per column',
    data: []
  }];
  public ticketsPerLabelData: ChartDataSets[] = [{
    label: 'Tickets per label',
    data: []
  }];
  public burnUpData = [];
  private tickets: Ticket[] = [];
  private lessTimeSpent = 0;
  private moreTimeSpent = 0;
  private exactTimeSpent = 0;
  public completedStatsData: number[] = [];
  public colorsForPieChart = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  public completedStatsLabels: Label[] = ["Completed on time", "Completed early", "Completed late"];

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
      this.tickets = tickets.filter(x => x.CompletedAt != null).sort((a,b) => new Date(a.CompletedAt).getTime() - new Date(b.CompletedAt).getTime());
      let y = 0;
      let firstDate = new Date(this.tickets[0].CompletedAt);
      this.burnUpData.push({
        x: new Date(firstDate.setDate(firstDate.getDate() - 7)),
        y: y
      });
      for (let ticket of this.tickets) {
        this.calculateStatsForGuessingTimeOfEndDate(ticket.EndDate, ticket.CompletedAt)
        y += ticket.StoryPoints;
        this.burnUpData.push({
          x: new Date(ticket.CompletedAt),
          y: y
        });
      }
      this.completedStatsData = [this.lessTimeSpent, this.exactTimeSpent, this.moreTimeSpent];
    });
  }

  private calculateStatsForGuessingTimeOfEndDate(endDate, completedAt) {
    if (endDate > completedAt) {
      this.moreTimeSpent += 1;
    } else if (endDate == completedAt) {
      this.exactTimeSpent += 1;
    } else {
      this.lessTimeSpent += 1;
    }
  }

}
