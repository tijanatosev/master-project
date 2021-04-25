import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Board } from "../../shared/services/board/board.model";
import { Router } from "@angular/router";
import { TicketService } from "../../shared/services/ticket/ticket.service";

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit {
  @Input() board: Board;
  @Input() isAdmin: boolean;
  @Output() boardDelete = new EventEmitter<Map<string, string>>();
  public numberOfTickets: number;

  constructor(private router: Router,
              private ticketService: TicketService) { }

  ngOnInit() {
    this.ticketService.getTicketsByTeamId(this.board.TeamId).subscribe(tickets => this.numberOfTickets = tickets.length);
  }

  public goToBoard(id) {
    this.router.navigate(['board', id]);
  }

  public onBoardDelete(id, name) {
    let values = new Map<string, string>();
    values.set("id", id);
    values.set("name", name);
    this.boardDelete.emit(values);
  }

}
