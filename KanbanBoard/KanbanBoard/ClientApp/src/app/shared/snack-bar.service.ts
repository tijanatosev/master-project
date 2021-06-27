import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { TicketService } from "./services/ticket/ticket.service";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar,
              private ticketService: TicketService) { }

  public successful() {
    this.snackBar.open("Successful", "DISMISS", {
      duration: 5000,
      panelClass: ["snack-bar"]
    });
  }

  public unsuccessful() {
    this.snackBar.open("Unsuccessful", "DISMISS", {
      duration: 5000,
      panelClass: ["snack-bar-unsuccessful"]
    });
  }

  public timerAlreadyRunning(ticketId) {
    this.ticketService.getTicket(ticketId).subscribe(ticket => {
      this.snackBar.open("Timer is already running for ticket " + ticket.Title + "!", "DISMISS", {
        duration: 7000,
        panelClass: ["snack-bar-unsuccessful"]
      });
    })
  }

  public timerFinishedPomodoro(ticketId) {
    this.ticketService.getTicket(ticketId).subscribe(ticket => {
      this.snackBar.open("Congrats! Timer for ticket " + ticket.Title + " is finished!", "DISMISS", {
        duration: 7000,
        panelClass: ["snack-bar-timer"]
      });
    });
  }
}
