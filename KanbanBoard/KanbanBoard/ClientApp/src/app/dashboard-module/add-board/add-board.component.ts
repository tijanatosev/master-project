import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Team } from "../../shared/services/team/team.model";
import { TeamService } from "../../shared/services/team/team.service";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { UserService } from "../../shared/services/user/user.service";
import { User } from "../../shared/services/user/user.model";
import { SnackBarService } from "../../shared/snack-bar.service";

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
  public users: User[] = [];

  constructor(private teamService: TeamService,
              private boardService: BoardService,
              private userService: UserService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(result => this.users = result);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

  save(boardForm) {
    let board = new Board();
    board.Admin = boardForm.value.admin;
    board.Name = boardForm.value.name;
    board.TeamId = boardForm.value.team.Id;
    this.boardService.addBoard(board).subscribe(boardId => {
      if (boardId > 0) {
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

}
