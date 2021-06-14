import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { Board } from "../../../shared/services/board/board.model";
import { TicketService } from "../../../shared/services/ticket/ticket.service";
import { ColumnService } from "../../../shared/services/column/column.service";
import { TeamService } from "../../../shared/services/team/team.service";

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
  private doneColumnId: number = 0;
  private doneTickets: number = 0;
  public columnsExist: boolean = false;
  public progressExists: boolean = false;
  public team: string;

  constructor(private router: Router,
              private ticketService: TicketService,
              private columnService: ColumnService,
              private teamService: TeamService) { }

  ngOnInit() {
    this.ticketService.getTicketsByTeamId(this.board.TeamId).subscribe(tickets => this.numberOfTickets = tickets.length);
    this.columnService.getColumnsByBoardId(this.board.Id).subscribe(columns => {
      if (columns.length > 0) {
        this.columnsExist = true;
        this.doneColumnId = columns.find(x => x.IsDone == true).Id;
        if (this.doneColumnId != 0) {
          this.ticketService.getTicketsByColumnId(this.doneColumnId, "").subscribe(tickets => {
            this.doneTickets = tickets.length > 0 ? tickets.length : 0;
            if (this.doneTickets == 0 && this.numberOfTickets == 0) {
              this.percentage = 0;
            } else {
              this.percentage = (this.doneTickets * 100 / this.numberOfTickets).toFixed(1);
            }
            this.progressExists = true;
          });
        }
      }
    });
    this.teamService.getTeam(this.board.TeamId).subscribe(team => this.team = team.Name);
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
