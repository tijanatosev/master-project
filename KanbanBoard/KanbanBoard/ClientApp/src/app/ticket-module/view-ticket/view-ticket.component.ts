import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../shared/services/user/user.service";
import { LabelService } from "../../shared/services/label/label.service";
import { Label } from "../../shared/services/label/label.model";
import { ColumnService } from "../../shared/services/column/column.service";
import { Column } from "../../shared/services/column/column.model";
import { BoardService } from "../../shared/services/board/board.service";
import { User } from "../../shared/services/user/user.model";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { map, startWith } from "rxjs/operators";
import { ChangeType, Priorities, Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";
import { FavoriteService } from "../../shared/services/favorite/favorite.service";
import { AuthService } from "../../shared/auth/auth.service";
import { Favorite } from "../../shared/services/favorite/favorite.model";
import { HelperService } from "../../shared/helpers/helper.service";
import { TimerService } from "../../shared/timer.service";
import { Board } from "../../shared/services/board/board.model";

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketId: number;
  public labels: Label[] = [];
  public removable: boolean = true;
  public statuses: Column[] = [];
  public members: User[];
  public reporter: string;
  public points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  public descriptionClicked = false;
  public titleClicked = false;
  public titleForm: FormGroup;
  public descriptionForm: FormGroup;
  public minDate = new Date("1/1/1970");
  public maxDate = new Date("1/1/2050");
  private loggedInUser: number;
  public isFavorite: boolean = false;
  public selectable = true;
  public labelControl = new FormControl();
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredLabels: Observable<Label[]>;
  public allLabels: Label[];
  public priorities = Priorities;
  public prioritiesValues = Priorities.values();
  private creator: User;
  private assignedTo: User;
  public startStopTimer: boolean = false;
  public isPomodoro: boolean = false;
  private board: Board;

  @ViewChild("labelInput", { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: true }) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private userService: UserService,
              private labelService: LabelService,
              private columnService: ColumnService,
              private boardService: BoardService,
              private snackBarService: SnackBarService,
              private formBuilder: FormBuilder,
              private favoriteService: FavoriteService,
              private authService: AuthService,
              private helperService: HelperService,
              private timerService: TimerService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
      let timer = this.authService.getTimer();
      if (timer != null && timer.ticketId == this.ticketId) {
        this.startStopTimer = true;
      }
    });
    this.loggedInUser = this.authService.getUserIdFromToken();
    this.favoriteService.isFavorite(this.ticketId, this.loggedInUser).subscribe(result => {
      this.isFavorite = result;
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.initTitleForm();
      this.initDescriptionForm();
      this.columnService.getColumnsByBoardId(this.ticket.BoardId).subscribe(statuses => this.statuses = statuses);
      this.boardService.getBoard(this.ticket.BoardId).subscribe(board => {
        this.board = board;
        this.isPomodoro = board.IsPomodoro;
        this.userService.getUsersByTeamId(board.TeamId).subscribe(users => {
          this.members = users;
          this.assignedTo = this.members.find(x => x.Id == this.ticket.AssignedTo);
          let reporter = users.filter(x => x.Username == this.ticket.Creator)[0];
          if (reporter && reporter.FirstName && reporter.LastName) {
            this.creator = reporter;
            this.reporter = reporter.FirstName + " " + reporter.LastName;
          } else {
            this.reporter = "";
          }
        });
      });
    });
    this.loadLabels();
    this.timerService.showTimer.subscribe(value => {
      if (value[0] == 0) {
        this.startStopTimer = false;
      }
    });
  }

  private loadLabels() {
    this.labelService.getLabelsByTicketId(this.ticketId).subscribe(labels => this.labels = labels);
    this.labelService.getLabels().subscribe(labels => {
      this.allLabels = labels;
      this.labels.forEach(label => {
        let index = this.allLabels.findIndex(x => x.Id == label.Id);
        if (index >= 0) {
          this.allLabels.splice(index, 1)
        }
      });
      this.filteredLabels = this.labelControl.valueChanges.pipe(
        startWith(null),
        map((label: Label | null) => label ? this._filter(label) : this.allLabels.slice()));
    });
  }

  public addLabel(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      let label = this.allLabels.filter(x => x.Name == value)[0];
      if (label != null || label != undefined) {
        this.labelService.addLabelByTicketId(label, this.ticketId).subscribe(x => {
          if (x > 0) {
            this.loadLabels();
            this.helperService.listenOnChangeMine(ChangeType.Labels, this.creator, this.ticketId, this.ticket.Title);
            if (this.assignedTo.Id != this.creator.Id) {
              this.helperService.listenOnChange(ChangeType.Labels, this.assignedTo, this.ticketId, this.ticket.Title);
            }
          }
        });
      }
    }

    if (input) {
      input.value = '';
    }
    this.labelControl.setValue(null);
  }

  public selected(event: MatAutocompleteSelectedEvent) {
    let index = this.labels.findIndex(x => x.Id == event.option.value.Id);
    if (index >= 0) {
      return;
    }

    this.labelService.addLabelByTicketId(event.option.value, this.ticketId).subscribe(x => {
      if (x > 0) {
        this.loadLabels();
        this.helperService.listenOnChangeMine(ChangeType.Labels, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.Labels, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
    this.labelControl.setValue(null);
  }

  public removeLabel(label) {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labelService.deleteByTicketId(label.Id, this.ticketId).subscribe(x => {
        this.loadLabels();
        this.helperService.listenOnChangeMine(ChangeType.Labels, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.Labels, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      });
    }
  }

  private _filter(value): Label[] {
    return this.allLabels.filter(label => label.Name.indexOf(value) === 0);
  }

  public updateStatus(event) {
    this.ticketService.updateColumn(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        let previousStatus = this.statuses.find(x => x.Name == this.ticket.Status);
        this.helperService.listenOnStatusChangeMine(previousStatus.Id, event.value, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnStatusChange(previousStatus.Id, event.value, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public updateAssignedTo(event) {
    this.ticketService.updateAssignedTo(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        this.helperService.listenOnChangeMine(ChangeType.AssignedTo, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.AssignedTo, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public updateStartDate(event) {
    this.ticketService.updateStartDate(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        this.ticket.StartDate = event.value;
        this.helperService.listenOnChangeMine(ChangeType.StartDate, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.StartDate, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public updateEndDate(event) {
    this.ticketService.updateEndDate(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        this.ticket.EndDate = event.value;
        this.helperService.listenOnChangeMine(ChangeType.EndDate, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.EndDate, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public updateStoryPoints(event) {
    this.ticketService.updateStoryPoints(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        this.helperService.listenOnChangeMine(ChangeType.StoryPoints, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.StoryPoints, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public updatePriority(event) {
    this.ticketService.updatePriority(this.ticketId, parseInt(event.value)).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        this.helperService.listenOnChangeMine(ChangeType.Priority, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.Priority, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public saveTitle(data) {
    this.titleClicked = false;
    if (data.value.title.trim().length == 0) {
      return;
    }

    let ticket = new Ticket();
    ticket.Title = data.value.title.trim();

    this.ticketService.updateTitle(this.ticketId, ticket).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        let previousTitle = this.ticket.Title;
        this.ticket.Title = data.value.title.trim();
        this.helperService.listenOnChangeMine(ChangeType.Title, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.Title, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public closeTitle() {
    this.titleClicked = false;
    this.titleForm.reset();
    this.initTitleForm();
  }

  public saveDescription(data) {
    this.descriptionClicked = false;
    if (data.value.description.trim().length == 0) {
      return;
    }

    let ticket = new Ticket();
    ticket.Description = data.value.description;

    this.ticketService.updateDescription(this.ticketId, ticket).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      } else {
        let previousDescription = this.ticket.Description;
        this.ticket.Description = data.value.description;
        this.helperService.listenOnChangeMine(ChangeType.Description, this.creator, this.ticketId, this.ticket.Title);
        if (this.assignedTo.Id != this.creator.Id) {
          this.helperService.listenOnChange(ChangeType.Description, this.assignedTo, this.ticketId, this.ticket.Title);
        }
      }
    });
  }

  public closeDescription() {
    this.descriptionClicked = false;
    this.descriptionForm.reset();
    this.initDescriptionForm();
  }

  public removeFromFavorites() {
    this.favoriteService.deleteFavorite(this.ticketId, this.loggedInUser).subscribe(_ => this.isFavorite = false);
  }

  public addToFavorites() {
    const favorite = new Favorite();
    favorite.TicketId = this.ticketId;
    favorite.UserId = this.loggedInUser;
    this.favoriteService.addFavorite(favorite).subscribe(result => {
      if (result > 0) {
        this.isFavorite = true;
      }
    });
  }

  public startOrStopTimer() {
    let timer = this.authService.getTimer();
    if (timer == null || timer.ticketId == this.ticketId) {
      this.startStopTimer = !this.startStopTimer;
      let startStop = this.startStopTimer ? 1 : 0;
      this.timerService.startStopTimer(startStop, this.ticketId, this.ticket.BoardId, this.board.WorkTime, this.board.BreakTime, this.board.LongerBreak, this.board.Iterations);
    } else {
      this.snackBarService.timerAlreadyRunning(timer.ticketId);
    }
  }

  private initTitleForm() {
    this.titleForm = this.formBuilder.group({
      title: [this.ticket.Title]
    });
  }

  private initDescriptionForm() {
    this.descriptionForm = this.formBuilder.group({
      description: [this.ticket.Description]
    });
  }
}
