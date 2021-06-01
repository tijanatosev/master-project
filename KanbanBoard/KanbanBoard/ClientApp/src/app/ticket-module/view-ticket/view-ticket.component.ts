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
              private helperService: HelperService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
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
      }
    });
    this.labelControl.setValue(null);
  }

  public removeLabel(label) {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labelService.deleteByTicketId(label.Id, this.ticketId).subscribe(x => {
        this.loadLabels();
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
      }
      let previousStatus = this.statuses.find(x => x.Name == this.ticket.Status);
      this.helperService.listenOnStatusChangeMine(previousStatus.Id, event.value, this.creator, this.ticketId, this.ticket.Title);
      if (this.assignedTo.Id != this.creator.Id) {
        this.helperService.listenOnStatusChange(previousStatus.Id, event.value, this.assignedTo, this.ticketId, this.ticket.Title);
      }
    });
  }

  public updateAssignedTo(event) {
    this.ticketService.updateAssignedTo(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public updateStartDate(event) {
    this.ticketService.updateStartDate(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
      this.ticket.StartDate = event.value;
    });
  }

  public updateEndDate(event) {
    this.ticketService.updateEndDate(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
      this.ticket.EndDate = event.value;
    });
  }

  public updateStoryPoints(event) {
    this.ticketService.updateStoryPoints(this.ticketId, event.value).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
      this.helperService.listenOnChangeMine(true, ChangeType.StoryPoints, this.creator, this.ticketId, this.ticket.Title);
      if (this.assignedTo.Id != this.creator.Id) {
        this.helperService.listenOnChange(true, ChangeType.StoryPoints, this.assignedTo, this.ticketId, this.ticket.Title);
      }
    });
  }

  public updatePriority(event) {
    this.ticketService.updatePriority(this.ticketId, parseInt(event.value)).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
      }
    });
  }

  public saveTitle(data) {
    this.titleClicked = false;
    console.log(data, data.value.title)
    if (data.value.title.trim().length == 0) {
      return;
    }
    this.ticket.Title = data.value.title.trim();
    let ticket = new Ticket();
    ticket.Title = data.value.title.trim();
    this.ticketService.updateTitle(this.ticketId, ticket).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
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
    this.ticket.Description = data.value.description;
    let ticket = new Ticket();
    ticket.Description = data.value.description;
    this.ticketService.updateDescription(this.ticketId, ticket).subscribe(result => {
      if (result != Responses.Successful) {
        this.snackBarService.unsuccessful();
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
