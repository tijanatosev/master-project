import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  public teamForm: FormGroup;
  public users: User[] = [];
  public loggedInUser;
  public selected: number[] = [];

  constructor(private teamService: TeamService,
              private userService: UserService,
              private snackBarService: SnackBarService,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getUsernameFromToken();
    this.teamForm = this.formBuilder.group( {
      name: ['', { validators: Validators.required, updateOn: "change" }],
      admin: [this.loggedInUser, { validators: Validators.required }],
      members: ['', { validators: Validators.required }]
    }, {
      validators: [this.validateName()]
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.selected.push(users.filter(u => u.Username == this.loggedInUser)[0].Id);
    });
  }

  public save(teamForm) {
    let team = new Team();
    team.Admin = teamForm.value.admin;
    team.Name = teamForm.value.name;
    let members = teamForm.value.members;
    this.teamService.addTeam(team).subscribe(teamId => {
      if (teamId > 0) {
        this.teamService.addUsersToTeam(teamId, members).subscribe(result => {
          if (result == Responses.Created) {
            this.snackBarService.successful();
          } else {
            this.snackBarService.unsuccessful();
          }
        });
      }
    });
  }

  private validateName() {
    return (control: AbstractControl) => {
      return control.value.name.length != 0 && control.value.name.trim().length == 0 ?
        this.teamForm.controls.name.setErrors({'nameInvalid': true}) : null
    };
  }
}
