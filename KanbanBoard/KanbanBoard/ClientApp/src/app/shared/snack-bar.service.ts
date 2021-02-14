import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  public successful() {
    this.snackBar.open("Successful", "DISMISS", {
      duration: 5000,
      panelClass: ["snack-bar"]
    });
  }

  public unsuccessful() {
    this.snackBar.open("Unsuccessful", "DISMISS", {
      duration: 5000,
      panelClass: ["snack-bar"]
    });
  }
}
