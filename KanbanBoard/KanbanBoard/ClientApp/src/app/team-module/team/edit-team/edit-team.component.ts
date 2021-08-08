import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../shared/services/user/user.model";
import {TeamService} from "../../../shared/services/team/team.service";
import {UserService} from "../../../shared/services/user/user.service";
import {FormBuilder, FormGroup } from "@angular/forms";
import {SnackBarService} from "../../../shared/snack-bar.service";
import {Responses} from "../../../shared/enums";
import {AuthService} from "../../../shared/auth/auth.service";

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {
  @Input() teamId: number;
  public teamForm: FormGroup;
  public members: number[] = [];
  public users: User[] = [];
  public newMembers: User[] = [];

  constructor(private teamService: TeamService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              private authService: AuthService) { }

  ngOnInit() {
    this.teamForm = this.formBuilder.group({
      members: [''],
    });
    this.userService.getUsersByTeamId(this.teamId).subscribe(members => {
      this.members = members.filter(x => x.Id != this.authService.getUserIdFromToken()).map(x => x.Id);
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(x => x.Id != this.authService.getUserIdFromToken());
    });
  }

  public compareSelectedUsers(userId1, userId2) {
    return userId1 == userId2;
  }

  public selectionChange(data) {
    let isUserInput = data.isUserInput;
    let changedOption = data.source;
    if (isUserInput) {
      if (changedOption._selected == true) {
        this.members.push(changedOption.value);
      } else {
        this.members = this.members.filter(x => x != changedOption.value.Id);
      }
    }
  }

  public save() {
    this.members.push(this.authService.getUserIdFromToken());
    this.teamService.addUsersToTeam(this.teamId, this.members).subscribe(result => {
      if (result == Responses.NoContent) {
        this.snackBarService.unsuccessful();
      } else {
        this.snackBarService.successful();
      }
    });
  }

}
