import { Component, OnInit } from '@angular/core';
import { Comment } from "../../shared/services/comment/comment.model";
import { ActivatedRoute, Params } from "@angular/router";
import { CommentService } from "../../shared/services/comment/comment.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../shared/auth/auth.service";
import { SnackBarService } from "../../shared/snack-bar.service";
import { HelperService } from "../../shared/helpers/helper.service";
import { UserService } from "../../shared/services/user/user.service";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";

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
  private ticket: Ticket;

  constructor(private route: ActivatedRoute,
              private commentService: CommentService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private snackBarService: SnackBarService,
              private helperService: HelperService,
              private userService: UserService,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
      this.ticketService.getTicket(this.ticketId).subscribe(ticket => this.ticket = ticket);
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
        this.userService.getUsers().subscribe(users => {
          let creator = users.find(x => x.Username == this.ticket.Creator);
          let assignedTo = users.find(x => x.Id == this.ticket.AssignedTo);
          console.log(comment.UserId, creator.Id, assignedTo.Id);
          if (comment.UserId != creator.Id) {
            this.helperService.listenOnComment(assignedTo, this.ticketId, this.ticket.Title, comment.Text);
          }
          if (creator.Id != assignedTo.Id && comment.UserId != assignedTo.Id) {
            this.helperService.listenOnCommentMine(creator, this.ticketId, this.ticket.Title, comment.Text);
          }
        });
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public loadComments() {
    this.commentService.getCommentsByTicketId(this.ticketId).subscribe(comments => this.comments = comments);
  }
}
