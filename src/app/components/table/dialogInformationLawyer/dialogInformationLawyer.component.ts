/* eslint-disable @angular-eslint/component-selector */
import { BddCommunicationService } from './../../../services/bdd-communication.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialogInformationLawyer',
  templateUrl: './dialogInformationLawyer.component.html',
  styleUrls: ['./dialogInformationLawyer.component.css']
})
export class DialogInformationLawyerComponent  {


  displayedColumns: string[] = ['formation', 'date', 'nbrDay', 'total'];
  dataTmp: any;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor( public dialogRef: MatDialogRef<DialogInformationLawyerComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data)
      this.dataTmp = [data];
    }


    onNoClick(): void {
      this.dialogRef.close();
    }

}
