import { Component, OnInit } from '@angular/core';
import { Board } from "../../shared/services/board/board.model";
import { User } from "../../shared/services/user/user.model";
import { UserService } from "../../shared/services/user/user.service";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public showAccount: boolean = false;
  public showNotifications: boolean = false;
  public showLabels: boolean = false;
  public showBoards: boolean = false;
  public showEditBoard: boolean = false;
  public board: Board = new Board();
  public previous: number = 0;
  public clicked: string;
  public user: User = new User();

  constructor(private userService: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userService.getUser(this.authService.getUserIdFromToken()).subscribe(user => this.user = user);
  }

  show(option) {
    if (option == this.previous) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showLabels = false;
      this.showBoards = false;
      this.showEditBoard = false;
      this.previous = 0;
      this.clicked = "none";
    } else if (option == 1) {
      this.showAccount = true;
      this.showNotifications = false;
      this.showLabels = false;
      this.showBoards = false;
      this.showEditBoard = false;
      this.previous = 1;
      this.clicked = "account";
    } else if (option == 2) {
      this.showAccount = false;
      this.showNotifications = true;
      this.showLabels = false;
      this.showBoards = false;
      this.showEditBoard = false;
      this.previous = 2;
      this.clicked = "notifications";
    } else if (option == 3) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showBoards = true;
      this.showEditBoard = false;
      this.showLabels = false;
      this.previous = 3;
      this.clicked = "boards";
    } else if (option == 4) {
      this.showAccount = false;
      this.showNotifications = false;
      this.showBoards = false;
      this.showEditBoard = false;
      this.showLabels = true;
      this.previous = 4;
      this.clicked = "labels";
    }
  }

  public onEditBoard(board: Board) {
    if (board != null) {
      this.showBoards = false;
      this.showEditBoard = true;
      this.board = board;
    }
  }

  public onBack(back: boolean) {
    if (back == true) {
      this.showBoards = true;
      this.showEditBoard = false;
    }
  }
}
