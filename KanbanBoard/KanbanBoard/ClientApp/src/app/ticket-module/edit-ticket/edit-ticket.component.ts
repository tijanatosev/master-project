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
import { FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { map, startWith } from "rxjs/operators";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketId: number;
  public labels: Label[] = [];
  public removable: boolean = true;
  public statuses: Column[] = [];
  public members: User[];
  public reporter: string;
  public points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  public selectable = true;
  public labelControl = new FormControl();
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredLabels: Observable<Label[]>;
  public allLabels: Label[];

  @ViewChild("labelInput", { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: true }) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private userService: UserService,
              private labelService: LabelService,
              private columnService: ColumnService,
              private boardService: BoardService,
              private snackBarService: SnackBarService) {  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.ticketId = +params['id'];
    });
    this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
      this.columnService.getColumnsByBoardId(this.ticket.BoardId).subscribe(statuses => this.statuses = statuses);
      this.boardService.getBoard(this.ticket.BoardId).subscribe(board => {
        this.userService.getUsersByTeamId(board.TeamId).subscribe(users => {
          this.members = users;
          let reporter = users.filter(x => x.Username == this.ticket.Creator)[0];
          this.reporter = reporter.FirstName + " " + reporter.LastName;
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
    });
  }
}
