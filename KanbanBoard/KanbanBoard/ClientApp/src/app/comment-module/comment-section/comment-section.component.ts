import { Component, OnInit } from '@angular/core';
import { Comment } from "../../shared/services/comment/comment.model";
import { ActivatedRoute, Params } from "@angular/router";
import { CommentService } from "../../shared/services/comment/comment.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../shared/auth/auth.service";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
  private ticketId: number;
  public comments: Comment[] = [];
  public commentForm;
  public commentClicked: boolean = false;

  constructor(private route: ActivatedRoute,
              private commentService: CommentService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.loadComments();
    this.commentForm = this.formBuilder.group({
      text: ['', [ Validators.required, Validators.nullValidator ]]
    });
  }

  public save(data) {
    let comment = new Comment();
    comment.Text = data.value.text;
    comment.CommentedAt = new Date();
    comment.UserId = this.authService.getUserIdFromToken();
    this.commentService.addComment(comment, this.ticketId).subscribe(result => {
      if (result > 0) {
        this.snackBarService.successful();
        this.commentForm.reset();
        this.loadComments();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public loadComments() {
    this.commentService.getCommentsByTicketId(this.ticketId).subscribe(comments => this.comments = comments);
  }
}
