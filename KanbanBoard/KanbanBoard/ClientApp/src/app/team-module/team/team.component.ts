import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { User } from "../../shared/services/user/user.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  public teamId: number;
  public members: User[] = [];
  public team: Team;
  public tickets: Ticket[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private teamService: TeamService,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.teamId = +params['id'];
    });
    this.teamService.getTeam(this.teamId).subscribe(team => this.team = team);
    this.userService.getUsersByTeamId(this.teamId).subscribe(members => this.members = members);
    this.ticketService.getTicketsByTeamId(this.teamId).subscribe(tickets => this.tickets = tickets);
  }

}
