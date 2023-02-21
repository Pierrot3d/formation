import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';
import { ExcelService } from 'src/app/services/excel.service';



@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogAddLawyer',
  templateUrl: './dialogAddLawyer.component.html',
  styleUrls: ['./dialogAddLawyer.component.css']
})
export class DialogAddLawyerComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogAddLawyerComponent>,
    private excelService: ExcelService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  addUser()
  {
    const value = {
      prenom: this.data.prenom,
      nom: this.data.nom,
      email: this.data.email,
      group: this.data.group? this.data.group: ""
    }
    this.excelService.saveLawyersToServer(value);
    this.excelService.getLawyersFromServer();
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}

