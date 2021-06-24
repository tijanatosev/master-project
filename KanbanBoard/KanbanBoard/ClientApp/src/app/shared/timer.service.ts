import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  @Output() showTimer = new EventEmitter<number[]>();

  constructor() { }

  public startStopTimer(startStop, ticketId, boardId) {
    this.showTimer.emit([startStop, ticketId, boardId]);
  }

}
