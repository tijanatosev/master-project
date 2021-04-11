import { Component, OnInit } from '@angular/core';
import { User} from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { AuthService } from "../../shared/auth/auth.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public teams: Team[];
  public tickets: Ticket[] = [];
  public userId;
  public favorites: Ticket[] = [];

  constructor(private userService: UserService,
              private authService: AuthService,
              private teamService: TeamService,
              private ticketService: TicketService,
              private router: Router) { }

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    this.userService.getUser(this.userId).subscribe(user => this.user = user);
    this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
    this.ticketService.getFavoritesByUserId(this.userId).subscribe(favorites => this.favorites = favorites);
  }

  goToTeam(id) {
    this.router.navigate(['/team/', id]);
  }
}
