import { Component, Input, OnInit } from '@angular/core';
import { Comment} from "../../shared/services/comment/comment.model";
import { UserService } from "../../shared/services/user/user.service";
import { User } from "../../shared/services/user/user.model";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  public user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser(this.comment.UserId).subscribe(user => this.user = user);
  }

}
