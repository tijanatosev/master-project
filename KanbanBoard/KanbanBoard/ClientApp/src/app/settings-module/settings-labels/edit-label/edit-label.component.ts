import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Colors, Responses } from "../../../shared/enums";
import { Label } from "../../../shared/services/label/label.model";
import { LabelService } from "../../../shared/services/label/label.service";
import { SnackBarService } from "../../../shared/snack-bar.service";

@Component({
  selector: 'app-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.css']
})
export class EditLabelComponent implements OnInit {
  public labelForm: FormGroup;
  public colorsValues = Colors.values();
  public colors = Colors;
  @Input() label: Label;

  constructor(private labelService: LabelService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.labelForm = this.formBuilder.group({
      name: [this.label.Name, { validators: [Validators.required, Validators.maxLength(20)], updateOn: "blur" }],
      color: [this.label.Color, { validators: [Validators.required], updateOn: "blur" }]
    }, {
      validators: [this.validateName()]
    });
    this.labelService.getLabels().subscribe(result => {
      for (let label of result) {
        if (label.Color != this.label.Color) {
          this.colorsValues = this.colorsValues.filter(color => label.Color != Colors[color]);
        }
      }
    });
  }

  public save(labelForm) {
    console.log(labelForm.value);
    let label = new Label();
    label.Name = labelForm.value.name;
    label.Color = labelForm.value.color;
    this.labelService.updateLabel(this.label.Id, label).subscribe(result => {
      if (result == Responses.NoContent) {
        this.snackBarService.unsuccessful();
      } else {
        this.snackBarService.successful();
      }
    });
  }

  private validateName() {
    return (control: AbstractControl) => {
      return control.value.name.length != 0 && control.value.name.trim().length == 0 ?
        this.labelForm.controls.name.setErrors({'nameInvalid': true}) : null
    };
  }

}
