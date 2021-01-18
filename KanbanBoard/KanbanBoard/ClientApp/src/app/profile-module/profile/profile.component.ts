import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { User} from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { AuthService } from "../../shared/auth/auth.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public user: User;
  public teams: Team[];
  public tickets: Ticket[] = [];
  private userId;
  public displayedColumns: string[] = ['Id', 'Title', 'Description', 'Creator', 'StoryPoints', 'Status', 'DateCreated', 'AssignedTo', 'Visit'];
  public numberOfTickets = 0;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService,
              private authService: AuthService,
              private teamService: TeamService,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    this.userService.getUser(this.userId).subscribe(user => this.user = user);
    this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);

  }

  ngAfterViewInit() {
    this.ticketService.getTicketsByUserId(this.userId).subscribe(tickets => {
      this.tickets = tickets;
      this.numberOfTickets = tickets.length;
    });
    this.paginator.pageIndex = 0;
  }

}
