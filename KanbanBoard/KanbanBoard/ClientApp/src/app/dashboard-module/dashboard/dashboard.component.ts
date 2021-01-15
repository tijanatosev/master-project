import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import { AddTeamComponent } from "../add-team/add-team.component";
import { Board } from "../../shared/services/board/board.model";
import { Team } from "../../shared/services/team/team.model";
import { BoardService } from "../../shared/services/board/board.service";
import { TeamService } from "../../shared/services/team/team.service";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import {AuthService} from "../../shared/auth/auth.service";

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
              private authService: AuthService) {
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

  openBoardDialog() {
    this.dialogBoardRef = this.boardDialog.open(AddBoardComponent, {
      width: '400px',
      height: '300px'
    });

    this.dialogBoardRef.afterClosed().subscribe(result => {
      this.boardService.getBoards().subscribe(boards => this.boards = boards);
    })
  }

  openTeamDialog() {
    this.dialogTeamRef = this.teamDialog.open(AddTeamComponent, {
      width: '400px',
      height: '300px'
    });

    this.dialogTeamRef.afterClosed().subscribe(result => {
      this.teamService.getTeams().subscribe(teams => this.teams = teams);
    })
  }

  onBoardDelete(id, name) {
    this.dialogConfirmBoardRef = this.confirmBoardDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmBoardRef.componentInstance.message = "Do you want to delete board " + name + "?";
    this.dialogConfirmBoardRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmBoardRef.componentInstance.cancelText = "No";

    this.dialogConfirmBoardRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.deleteBoard(id).subscribe(result => {
          this.boardService.getBoards().subscribe(boards => this.boards = boards);
        });
      }
    })
  }

  onTeamDelete(id, name) {
    this.dialogConfirmTeamRef = this.confirmTeamDialog.open(ConfirmationDialogComponent);
    this.dialogConfirmTeamRef.componentInstance.message = "Do you want to delete team " + name + "?";
    this.dialogConfirmTeamRef.componentInstance.confirmText = "Yes";
    this.dialogConfirmTeamRef.componentInstance.cancelText = "No";

    this.dialogConfirmTeamRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(id).subscribe(result => {
          this.teamService.getTeams().subscribe(teams => this.teams = teams);
        });
      }
    });
  }
}
