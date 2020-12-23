import { Component, OnInit } from '@angular/core';
import { Board } from '../services/board/board.model';
import { BoardService } from '../services/board/board.service';
import { Team } from '../services/team/team.model';
import { TeamService } from '../services/team/team.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import {AddTeamComponent} from "../add-team/add-team.component";
import {ConfirmationDialogComponent} from "../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public boards: Board[] = [];
  public teams: Team[] = [];
  public dialogBoardRef: MatDialogRef<any>;
  public dialogTeamRef: MatDialogRef<any>;
  public dialogConfirmBoardRef: MatDialogRef<any>;
  public dialogConfirmTeamRef: MatDialogRef<any>;

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private boardDialog: MatDialog,
              private teamDialog: MatDialog,
              private confirmBoardDialog: MatDialog,
              private confirmTeamDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(boards => this.boards = boards);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
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
