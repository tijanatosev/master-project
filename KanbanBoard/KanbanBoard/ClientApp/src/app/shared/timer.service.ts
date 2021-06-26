import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  @Output() showTimer = new EventEmitter<number[]>();
  @Output() break = new EventEmitter<number[]>();

  constructor() { }

  public startStopTimer(startStop, ticketId, boardId) {
    this.showTimer.emit([startStop, ticketId, boardId]);
  }

  public startBreak(ticketId, boardId) {
    this.break.emit([1, ticketId, boardId]);
  }

}
