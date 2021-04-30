import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from "../../../shared/services/team/team.model";
import { Router } from "@angular/router";
import { UserService } from "../../../shared/services/user/user.service";
import { BoardService } from "../../../shared/services/board/board.service";
import { TicketService } from "../../../shared/services/ticket/ticket.service";

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {
  @Input() team: Team;
  @Input() isAdmin: boolean;
  @Output() teamDelete = new EventEmitter()
  public numberOfMembers: number;
  public numberOfBoards: number;
  public numberOfTickets: number;

  constructor(private router: Router,
              private userService: UserService,
              private boardService: BoardService,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.userService.getUsersByTeamId(this.team.Id).subscribe(users => this.numberOfMembers = users.length);
    this.boardService.getBoardsByTeamId(this.team.Id).subscribe(boards => this.numberOfBoards = boards.length);
    this.ticketService.getTicketsByTeamId(this.team.Id).subscribe(tickets => this.numberOfTickets = tickets.length);
  }

  public goToTeam(id) {
    this.router.navigate(['team', id]);
  }

  public onTeamDelete(id, name) {
    let values = new Map<string, string>();
    values.set("id", id);
    values.set("name", name);
    this.teamDelete.emit(values);
  }
}
