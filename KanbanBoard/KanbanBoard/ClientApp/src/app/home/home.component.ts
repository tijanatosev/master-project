import { Component, OnInit } from '@angular/core';
import { Board } from '../services/board/board.model';
import { BoardService } from '../services/board/board.service';
import { Team } from '../services/team/team.model';
import { TeamService } from '../services/team/team.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddBoardComponent } from '../add-board/add-board.component';
import {AddTeamComponent} from "../add-team/add-team.component";

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

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private boardDialog: MatDialog,
              private teamDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(boards => this.boards = boards);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

  openBoardDialog() {
    this.dialogBoardRef = this.boardDialog.open(AddBoardComponent, {
      direction: 'rtl',
      width: '400px',
      height: '300px'
    });

    this.dialogBoardRef.afterClosed().subscribe(result => {
      this.boardService.getBoards().subscribe(boards => this.boards = boards);
    })
  }

  openTeamDialog() {
    this.dialogTeamRef = this.teamDialog.open(AddTeamComponent, {
      direction: 'rtl',
      width: '400px',
      height: '300px'
    });

    this.dialogTeamRef.afterClosed().subscribe(result => {
      this.teamService.getTeams().subscribe(teams => this.teams = teams);
    })
  }
}
