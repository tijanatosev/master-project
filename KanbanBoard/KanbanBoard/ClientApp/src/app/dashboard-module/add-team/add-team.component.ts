import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";


@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  public teamForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    admin: new FormControl('', Validators.required),
    members: new FormControl('', Validators.required)
  });
  public users: User[] = [];

  constructor(private teamService: TeamService,
              private userService: UserService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(result => this.users = result);
  }

  save(teamForm) {
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

}
