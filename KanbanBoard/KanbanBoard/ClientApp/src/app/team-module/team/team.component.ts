import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { User } from "../../shared/services/user/user.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit {
  public teamId: number;
  public members: User[] = [];
  public team: Team;
  public tickets: Ticket[] = [];
  public boards: Board[] = [];
  public dataSource: MatTableDataSource<Ticket>;
  public displayedColumns: string[] = ['Id', 'Title', 'Description', 'Creator', 'StoryPoints', 'Status', 'DateCreated', 'AssignedTo', 'Visit'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private teamService: TeamService,
              private ticketService: TicketService,
              private boardService: BoardService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.teamId = +params['id'];
    });
    this.teamService.getTeam(this.teamId).subscribe(team => this.team = team);
    this.userService.getUsersByTeamId(this.teamId).subscribe(members => this.members = members);
    this.boardService.getBoardsByTeamId(this.teamId).subscribe(boards => this.boards = boards);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.ticketService.getTicketsByTeamId(this.teamId).subscribe(tickets => {
      this.tickets = tickets;
      this.dataSource = new MatTableDataSource<Ticket>(tickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

}
