import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LabelService } from "../../../shared/services/label/label.service";
import { Colors } from "../../../shared/enums";
import { Label } from "../../../shared/services/label/label.model";
import { SnackBarService } from "../../../shared/snack-bar.service";

@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.component.html',
  styleUrls: ['./add-label.component.css']
})
export class AddLabelComponent implements OnInit {

  public labelForm: FormGroup;
  public colorsValues = Colors.values();
  private label: Label;
  public colors = Colors;

  constructor(private labelService: LabelService,
              private formBuilder: FormBuilder,
              private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.labelForm = this.formBuilder.group({
      name: ['', { validators: [Validators.required, Validators.maxLength(20)], updateOn: "blur" }],
      color: ['', { validators: [Validators.required], updateOn: "blur" }]
    });
    this.labelService.getLabels().subscribe(result => {
      for (let label of result) {
        this.colorsValues = this.colorsValues.filter(color => label.Color != Colors[color])
      }
    });
    console.log();

  }

  public save(labelForm) {
    this.label = new Label();
    this.label.Name = labelForm.value.name;
    this.label.Color = labelForm.value.color;
    this.labelService.addLabel(this.label).subscribe(labelId => {
      if (labelId > 0) {
        this.snackBarService.successful();
      } else {
        this.snackBarService.unsuccessful();
      }
    });
  }

}
