import { Component, OnInit } from '@angular/core';
import { Board } from '../services/board/board.model';
import { BoardService } from '../services/board/board.service';
import { Team } from '../services/team/team.model';
import { TeamService } from '../services/team/team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public boards: Board[] = [];
  public teams: Team[] = [];

  constructor(private boardService: BoardService,
              private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(boards => this.boards = boards);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

}
