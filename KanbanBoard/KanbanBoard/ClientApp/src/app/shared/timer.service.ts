import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  @Output() showTimer = new EventEmitter<number[]>();

  constructor() { }

  public startStopTimer(startStop, ticketId, boardId, workTime, breakTime, longerBreak, iterations) {
    this.showTimer.emit([startStop, ticketId, boardId, workTime, breakTime, longerBreak, iterations]);
  }
}
