import { Component, OnInit } from '@angular/core';
import { LabelService } from "../../shared/services/label/label.service";
import { Label } from "../../shared/services/label/label.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { AddLabelComponent } from "./add-label/add-label.component";
import { EditLabelComponent } from "./edit-label/edit-label.component";

@Component({
  selector: 'app-settings-labels',
  templateUrl: './settings-labels.component.html',
  styleUrls: ['./settings-labels.component.css']
})
export class SettingsLabelsComponent implements OnInit {
  public labels: Label[];
  public confirmDialogRef: MatDialogRef<any>;
  public dialogAddLabelRef: MatDialogRef<any>;
  public confirmAllDialogRef: MatDialogRef<any>;
  public dialogEditLabelRef: MatDialogRef<any>;

  constructor(private labelService: LabelService,
              private confirmDialog: MatDialog,
              private labelDialog: MatDialog,
              private confirmAllDialog: MatDialog) { }

  ngOnInit() {
    this.loadLabels();
  }

  public openAddDialog() {
    this.dialogAddLabelRef = this.labelDialog.open(AddLabelComponent, {
      width: '430px',
      height: '320px'
    });

    this.dialogAddLabelRef.afterClosed().subscribe(result => {
      this.loadLabels();
    });
  }

  public openDeleteDialog(id, name) {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationDialogComponent);
    this.confirmDialogRef.componentInstance.message = "Are you sure you want to permanently delete label " + name + "?";
    this.confirmDialogRef.componentInstance.confirmText = "Yes";
    this.confirmDialogRef.componentInstance.cancelText = "No";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.labelService.deleteLabel(id).subscribe(() => {
          this.loadLabels();
        });
      }
    });
  }

  public openRemoveAllDialog() {
    this.confirmAllDialogRef = this.confirmAllDialog.open(ConfirmationDialogComponent);
    this.confirmAllDialogRef.componentInstance.message = "Are you sure you want to permanently delete all labels?";
    this.confirmAllDialogRef.componentInstance.confirmText = "Yes";
    this.confirmAllDialogRef.componentInstance.cancelText = "No";

    this.confirmAllDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.labelService.deleteAllLabels().subscribe(() => {
          this.loadLabels();
        });
      }
    });
  }

  public openEditDialog(label) {
    this.dialogEditLabelRef = this.labelDialog.open(EditLabelComponent, {
      width: '430px',
      height: '320px'
    });
    this.dialogEditLabelRef.componentInstance.label = label;

    this.dialogEditLabelRef.afterClosed().subscribe(result => {
      this.loadLabels();
    });
  }

  private loadLabels() {
    this.labelService.getLabels().subscribe(labels => this.labels = labels);
  }
}
