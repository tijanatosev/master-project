import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../services/team/team.service';
import { Team } from '../services/team/team.model';
import { Board } from '../services/board/board.model';
import { BoardService } from '../services/board/board.service';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.css']
})
export class AddBoardComponent implements OnInit {
  public boardForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    admin: new FormControl('', Validators.required),
    team: new FormControl('', Validators.required)
  });
  public teams: Team[] = [];

  constructor(private teamService: TeamService,
              private boardService: BoardService) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

  save(boardForm) {
    let board = new Board();
    board.Admin = boardForm.value.admin;
    board.Name = boardForm.value.name;
    board.TeamId = boardForm.value.team.Id;
    this.boardService.addBoard(board).subscribe();
  }

}
