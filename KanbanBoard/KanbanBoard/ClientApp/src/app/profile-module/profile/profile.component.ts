import { Component, OnInit } from '@angular/core';
import { User } from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { AuthService } from "../../shared/auth/auth.service";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { Router } from "@angular/router";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public teams: Team[];
  public tickets: Ticket[] = [];
  public userId;
  public favorites: Ticket[] = [];
  public image: string;

  constructor(private userService: UserService,
              private authService: AuthService,
              private teamService: TeamService,
              private ticketService: TicketService,
              private router: Router,
              private http: HttpClient,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    this.userService.getUser(this.userId).subscribe(user => {
      this.user = user;
      this.image = user.Image;
    });
    this.teamService.getTeamsByUserId(this.userId).subscribe(teams => this.teams = teams);
    this.ticketService.getFavoritesByUserId(this.userId).subscribe(favorites => this.favorites = favorites);
  }

  public goToTeam(id) {
    this.router.navigate(['/team/', id]);
  }

  public upload(event) {
    let files = event.files;
    if (files.length == 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('user', this.userId);
    this.http.post('https://localhost:5001/api/helpers/file', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          let tmp = new User();
          tmp.Image = event.body["path"];
          this.userService.updateImage(this.userId, tmp).subscribe(result => {
            if (result == Responses.Successful) {
              this.snackBarService.successful();
              this.image = tmp.Image;
            } else {
              this.snackBarService.unsuccessful();
            }
          });
        }
      });
  }

  public openFileUpload() {
    document.querySelector('input').click();
  }
}
