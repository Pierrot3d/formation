/* eslint-disable @angular-eslint/component-selector */
import { BddCommunicationService } from './../../../services/bdd-communication.service';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogExcel',
  templateUrl: './dialogExcel.component.html',
  styleUrls: ['./dialogExcel.component.css']
})
export class DialogExcelComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogExcelComponent>,
    private bddCommunicationService: BddCommunicationService
  ) {}



  onNoClick(): void {
    this.dialogRef.close();
  }
}
