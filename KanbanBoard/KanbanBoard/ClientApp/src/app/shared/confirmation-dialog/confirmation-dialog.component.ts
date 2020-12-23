import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() message: string;
  @Input() confirmText: string;
  @Input() cancelText: string;

  constructor(private dialog: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

  public onConfirm() {
    this.dialog.close(true);
  }

}
