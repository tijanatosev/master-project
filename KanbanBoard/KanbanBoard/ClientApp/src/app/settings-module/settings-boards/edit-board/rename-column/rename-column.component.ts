import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ColumnService } from "../../../../shared/services/column/column.service";
import { SnackBarService } from "../../../../shared/snack-bar.service";
import { Responses } from "../../../../shared/enums";
import { Column } from "../../../../shared/services/column/column.model";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-rename-column',
  templateUrl: './rename-column.component.html',
  styleUrls: ['./rename-column.component.css']
})
export class RenameColumnComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() boardId: number;
  public columnForm: FormGroup;
  private columns;

  constructor(private formBuilder: FormBuilder,
              private columnService: ColumnService,
              private snackBarService: SnackBarService,
              public dialogRef: MatDialogRef<RenameColumnComponent>) { }

  ngOnInit() {
    this.columnForm = this.formBuilder.group({
      columnName: [this.name, { validators: [Validators.maxLength(20), Validators.required], updateOn: "blur" }]
    },  {
      validators: [this.validateColumnName()]
    });
    this.columnService.getColumnsByBoardId(this.boardId).subscribe(columns => this.columns = columns.filter(x => x.Id != this.id));
  }

  public save(data) {
    let exists = this.columns.find(x => data.value.columnName == x.Name);
    if (exists != null) {
      this.columnForm.controls.columnName.setErrors({'nameExists': true});
    } else {
      let column = new Column();
      column.Name = data.value.columnName;
      this.columnService.update(this.id, column).subscribe(result => {
        if (result == Responses.NoContent) {
          this.snackBarService.unsuccessful();
        } else {
          this.snackBarService.successful();
          this.dialogRef.close(true);
        }
      });
    }
  }

  private validateColumnName() {
    return (control: AbstractControl) => {
      return control.value.columnName && control.value.columnName.length != 0 && control.value.columnName.trim().length == 0 ?
        this.columnForm.controls.columnName.setErrors({'nameInvalid': true}) : null;
    };
  }
}
