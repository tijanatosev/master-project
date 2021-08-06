import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { User } from "../../shared/services/user/user.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { EditTeamComponent } from "./edit-team/edit-team.component";
import { AuthService } from "../../shared/auth/auth.service";

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
  public boards: Board[] = [];
  public dialogEditTeamRef: MatDialogRef<any>;
  public canEdit: boolean = false;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private teamService: TeamService,
              private ticketService: TicketService,
              private boardService: BoardService,
              private router: Router,
              private teamDialog: MatDialog,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.teamId = +params['id'];
    });
    this.loadTeam();
  }

  public goToBoard(id) {
    this.router.navigate(['board', id]);
  }

  public edit() {
    this.dialogEditTeamRef = this.teamDialog.open(EditTeamComponent, {
      width: '430px',
      height: '280px'
    });
    this.dialogEditTeamRef.componentInstance.teamId = this.teamId;

    this.dialogEditTeamRef.afterClosed().subscribe(result => {
      this.loadTeam();
    });
  }

  private loadTeam() {
    this.teamService.getTeam(this.teamId).subscribe(team => {
      this.team = team;
      this.canEdit = team.Admin == this.authService.getUsernameFromToken();
    });
    this.userService.getUsersByTeamId(this.teamId).subscribe(members => this.members = members);
    this.boardService.getBoardsByTeamId(this.teamId).subscribe(boards => this.boards = boards);
  }
}
