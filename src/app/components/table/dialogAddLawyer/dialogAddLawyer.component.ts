import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';



@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogAddLawyer',
  templateUrl: './dialogAddLawyer.component.html',
  styleUrls: ['./dialogAddLawyer.component.css']
})
export class DialogAddLawyerComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogAddLawyerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }
}

