import { Component, OnInit } from '@angular/core';
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { LabelService } from "../../shared/services/label/label.service";
import { Label } from "../../shared/services/label/label.model";
import { ColumnService } from "../../shared/services/column/column.service";
import { Column } from "../../shared/services/column/column.model";
import { BoardService } from "../../shared/services/board/board.service";
import { User } from "../../shared/services/user/user.model";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketId: number;
  public labels: Label[] = [];
  public removable: boolean = true;
  public statuses: Column[] = [];
  public members: User[];
  public reporter: string;

  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private userService: UserService,
              private labelService: LabelService,
              private columnService: ColumnService,
              private boardService: BoardService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.columnService.getColumnsByBoardId(this.ticket.BoardId).subscribe(statuses => this.statuses = statuses);
      this.boardService.getBoard(this.ticket.BoardId).subscribe(board => {
        this.userService.getUsersByTeamId(board.TeamId).subscribe(users => {
          this.members = users;
          let reporter = users.filter(x => x.Username == this.ticket.Creator)[0];
          this.reporter = reporter.FirstName + " " + reporter.LastName;
        });
      });
    });
    this.loadLabels();
  }

  public remove(labelId) {
    this.labelService.deleteByTicketId(labelId, this.ticketId).subscribe(() => this.loadLabels());
  }

  private loadLabels() {
    this.labelService.getLabelsByTicketId(this.ticketId).subscribe(labels => this.labels = labels);
  }

}
