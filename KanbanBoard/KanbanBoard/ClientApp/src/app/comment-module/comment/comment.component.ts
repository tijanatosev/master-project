import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment} from "../../shared/services/comment/comment.model";
import { UserService } from "../../shared/services/user/user.service";
import { User } from "../../shared/services/user/user.model";
import { CommentService } from "../../shared/services/comment/comment.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";
import { AuthService } from "../../shared/auth/auth.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Output() commentUpdated = new EventEmitter<boolean>();
  public user: User;
  public edit: boolean = false;
  public commentForm;
  public editCommentClicked: boolean = false;

  constructor(private userService: UserService,
              private commentService: CommentService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userService.getUser(this.comment.UserId).subscribe(user => this.user = user);
    this.commentForm = this.formBuilder.group({
      textComment: [this.comment.Text, [Validators.required, Validators.minLength(1)]]
    });
    this.edit = this.comment.UserId == this.authService.getUserIdFromToken();
  }

  public updateComment(data) {
    if (data.value.textComment.trim().length == 0) {
      this.snackBarService.unsuccessful();
      this.edit = false;
    }
    let comment = new Comment();
    comment.Text = data.value.textComment;
    comment.TicketId = this.comment.TicketId;
    this.commentService.updateComment(this.comment.Id, comment).subscribe(result => {
      if (result == Responses.Successful) {
        this.comment.Text = comment.Text;
        this.snackBarService.successful();
        this.edit = false;
        this.commentUpdated.emit(true);
      } else {
        this.snackBarService.unsuccessful();
      }
    })
  }

  public deleteComment() {
    this.commentService.deleteComment(this.comment.Id).subscribe(result => {
      this.commentUpdated.emit(true);
      this.snackBarService.successful();
    });
  }

}
