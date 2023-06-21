import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGeneral } from 'src/app/models/general.model';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';

@Component({
  selector: 'app-dialog-general',
  templateUrl: './dialog-general.component.html',
  styleUrls: ['./dialog-general.component.scss']
})
export class DialogGeneralComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogGeneralComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: FormGeneral,
  ) {

  }

  updateBatonnier()
  {
    this.bddCommunicationService.updateGeneral(this.data.id, this.data.prenom, this.data.nom);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
