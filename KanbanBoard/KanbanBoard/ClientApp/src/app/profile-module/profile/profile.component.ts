import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User} from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { AuthService } from "../../shared/auth/auth.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";

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
  public dataSource: MatTableDataSource<Ticket>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private userService: UserService,
              private authService: AuthService,
              private teamService: TeamService,
              private ticketService: TicketService,
              private router: Router) { }

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    this.userService.getUser(this.userId).subscribe(user => this.user = user);
    this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.ticketService.getTicketsByUserId(this.userId).subscribe(tickets => {
      this.tickets = tickets;
      this.dataSource = new MatTableDataSource<Ticket>(tickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  goToTeam(id) {
    this.router.navigate(['/team/', id]);
  }
}
