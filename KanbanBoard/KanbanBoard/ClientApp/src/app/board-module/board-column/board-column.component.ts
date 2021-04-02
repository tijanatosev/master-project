import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketService } from "../../shared/services/ticket/ticket.service";
import { Ticket } from "../../shared/services/ticket/ticket.model";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Responses } from "../../shared/enums";
import { SnackBarService } from "../../shared/snack-bar.service";

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.css']
})
export class BoardColumnComponent implements OnInit {
  @Input() columnId: number;
  @Input() containerId: number;
  @Output() changeColumns = new EventEmitter<number[]>();
  public tickets: Ticket[];

  constructor(private ticketService: TicketService,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.ticketService.getTicketsByColumnId(this.columnId).subscribe(tickets => {
      this.tickets = tickets;
      this.tickets.sort((x, y) => x.Rank - y.Rank);
    });
  }

  public drop(event: CdkDragDrop<Ticket[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let newColumnId = parseInt(event.container.id);
      let ticketId = event.previousContainer.data[event.previousIndex].Id
      this.changeColumns.emit([newColumnId, ticketId]);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.updateRank(event.container.data);
  }

  private updateRank(tickets) {
    for (let i = 0; i < tickets.length; i++) {
      this.ticketService.updateRank(tickets[i].Id, i + 1).subscribe(result => {
        if (result != Responses.Successful) {
          this.snackBarService.unsuccessful();
        }
      });
    }
  }
}