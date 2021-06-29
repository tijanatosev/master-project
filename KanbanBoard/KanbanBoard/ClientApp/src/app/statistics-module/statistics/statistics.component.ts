import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { ColumnService } from "../../shared/services/column/column.service";
import { Label } from "ng2-charts";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { LabelService } from "../../shared/services/label/label.service";
import { BoardService } from "../../shared/services/board/board.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  private boardId: number;
  public chartOptions: ChartOptions = {
    responsive: true,
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

  constructor(private route: ActivatedRoute,
              private columnService: ColumnService,
              private labelService: LabelService,
              private boardService: BoardService) { }

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
  }

}
