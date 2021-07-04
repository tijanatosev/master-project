import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import { AddTeamComponent } from "../add-team/add-team.component";
import { Board } from "../../shared/services/board/board.model";
import { Team } from "../../shared/services/team/team.model";
import { BoardService } from "../../shared/services/board/board.service";
import { TeamService } from "../../shared/services/team/team.service";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../../shared/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public boards: Board[] = [];
  public teams: Team[] = [];
  public dialogBoardRef: MatDialogRef<any>;
  public dialogTeamRef: MatDialogRef<any>;
  public dialogConfirmBoardRef: MatDialogRef<any>;
  public dialogConfirmTeamRef: MatDialogRef<any>;
  public isAdmin: boolean = false;
  private userId;

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private boardDialog: MatDialog,
              private teamDialog: MatDialog,
              private confirmBoardDialog: MatDialog,
              private confirmTeamDialog: MatDialog,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.userId = this.authService.getUserIdFromToken();
    if (this.isAdmin == false && this.userId != null) {
      this.boardService.getBoardsByUserId(this.userId).subscribe(boards => this.boards = boards);
      this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
    } else {
      this.boardService.getBoards().subscribe(boards => this.boards = boards);
      this.teamService.getTeams().subscribe(teams => this.teams = teams);
    }
  }

  public openBoardDialog() {
    this.dialogBoardRef = this.boardDialog.open(AddBoardComponent, {
      width: '430px',
      height: '380px'
    });

    this.dialogBoardRef.afterClosed().subscribe(result => {
      if (this.isAdmin == false && this.userId != null) {
        this.boardService.getBoardsByUserId(this.userId).subscribe(boards => this.boards = boards);
      } else {
        this.boardService.getBoards().subscribe(boards => this.boards = boards);
      }
    });
  }

  public openTeamDialog() {
    this.dialogTeamRef = this.teamDialog.open(AddTeamComponent, {
      width: '430px',
      height: '380px'
    });

    this.dialogTeamRef.afterClosed().subscribe(result => {
      if (this.isAdmin == false && this.userId != null) {
        this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
      } else {
        this.teamService.getTeams().subscribe(teams => this.teams = teams);
      }
    });
  }

  public onBoardDelete(data) {
    let id = data.get("id");
    let name = data.get("name");
    this.dialogConfirmBoardRef = this.confirmBoardDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmBoardRef.componentInstance.message = "Are you sure you want to permanently delete board " + name + "?";
    this.dialogConfirmBoardRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmBoardRef.componentInstance.cancelText = "No";

    this.dialogConfirmBoardRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.deleteBoard(id).subscribe(res => {
          if (this.isAdmin == false && this.userId != null) {
            this.boardService.getBoardsByUserId(this.userId).subscribe(boards => this.boards = boards);
          } else {
            this.boardService.getBoards().subscribe(boards => this.boards = boards);
          }
        });
      }
    });
  }

  public onTeamDelete(data) {
    let id = data.get("id");
    let name = data.get("name");
    this.dialogConfirmTeamRef = this.confirmTeamDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmTeamRef.componentInstance.message = "Are you sure you want to permanently delete team " + name + "?";
    this.dialogConfirmTeamRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmTeamRef.componentInstance.cancelText = "No";

    this.dialogConfirmTeamRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(id).subscribe(res => {
          if (this.isAdmin == false && this.userId != null) {
            this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
            this.boardService.getBoardsByUserId(this.userId).subscribe(boards => this.boards = boards);
          } else {
            this.teamService.getTeams().subscribe(teams => this.teams = teams);
            this.boardService.getBoards().subscribe(boards => this.boards = boards);
          }
        });
      }
    });
  }

  public goToBoard(id) {
    this.router.navigate(['board', id]);
  }

  public goToTeam(id) {
    this.router.navigate(['team', id]);
  }
}
