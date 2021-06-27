import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from "../../shared/services/team/team.model";
import { TeamService } from "../../shared/services/team/team.service";
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { UserService } from "../../shared/services/user/user.service";
import { User } from "../../shared/services/user/user.model";
import { SnackBarService } from "../../shared/snack-bar.service";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.css']
})
export class AddBoardComponent implements OnInit {
  public boardForm: FormGroup;
  public teams: Team[] = [];
  public users: User[] = [];
  public loggedInUser;
  public isPomodoro: boolean = false;
  private defaultWorkTime = 25;
  private defaultBreakTime = 5;
  private defaultIterations = 4;
  private defaultLongerBreak = 30;

  constructor(private teamService: TeamService,
              private boardService: BoardService,
              private userService: UserService,
              private snackBarService: SnackBarService,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getUsernameFromToken();
    this.boardForm = this.formBuilder.group( {
      name: ['', { validators: Validators.required, updateOn: "change" }],
      admin: [this.loggedInUser, { validators: Validators.required }],
      team: ['', { validators: Validators.required }],
      isPomodoro: [''],
      workTime: [this.defaultWorkTime],
      breakTime: [this.defaultBreakTime],
      iterations: [this.defaultIterations],
      longerBreak: [this.defaultLongerBreak]
    }, {
      validators: [this.validateName()]
    });
    this.userService.getUsers().subscribe(result => this.users = result);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

  public save(boardForm) {
    let board = new Board();
    board.Name = boardForm.value.name;
    board.Admin = boardForm.value.admin;
    board.TeamId = boardForm.value.team.Id;
    board.IsPomodoro = boardForm.value.isPomodoro;
    board.WorkTime = board.IsPomodoro ? boardForm.value.workTime : this.defaultWorkTime;
    board.BreakTime = board.IsPomodoro ? boardForm.value.breakTime : this.defaultBreakTime;
    board.Iterations = board.IsPomodoro ? boardForm.value.iterations : this.defaultIterations;
    board.LongerBreak = board.IsPomodoro ? boardForm.value.longerBreak : this.defaultLongerBreak;
    this.boardService.addBoard(board).subscribe(boardId => {
      if (boardId > 0) {
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  private validateName() {
    return (control: AbstractControl) => {
      return control.value.name.length != 0 && control.value.name.trim().length == 0 ?
        this.boardForm.controls.name.setErrors({'nameInvalid': true}) : null
    };
  }

}
