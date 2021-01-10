import { Component, OnInit } from '@angular/core';
import { User} from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  tasks = [1,2,3,4,5];
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = new User();
    this.user.Username = "ttosev";
    this.user.FirstName = "Tijana";
    this.user.LastName = "Tosev";
  }

}
