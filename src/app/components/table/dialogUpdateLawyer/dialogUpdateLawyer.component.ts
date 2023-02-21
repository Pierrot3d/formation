import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogUpdateLawyer',
  templateUrl: './dialogUpdateLawyer.component.html',
  styleUrls: ['./dialogUpdateLawyer.component.css']
})
export class DialogUpdateLawyerComponent {

  constructor(public dialogRef: MatDialogRef<DialogUpdateLawyerComponent>,
    private excelService: ExcelService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  updateUser()
  {
    this.excelService.updateUser(this.data.id, this.data.prenom, this.data.nom, this.data.email, this.data.group? this.data.group: "")
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
