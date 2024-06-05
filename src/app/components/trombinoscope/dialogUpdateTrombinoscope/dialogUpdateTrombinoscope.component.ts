/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogData } from '../../table/table/table.component';
import { HttpClient } from '@angular/common/http';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogUpdateTrombinoscope',
  templateUrl: './dialogUpdateTrombinoscope.component.html',
  styleUrls: ['./dialogUpdateTrombinoscope.component.css']
})
export class DialogUpdateTrombinoscopeComponent   {



  constructor(
    public dialogRef: MatDialogRef<DialogUpdateTrombinoscopeComponent>,
    private bddCommunicationService: BddCommunicationService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}



  updateUser() {
    this.bddCommunicationService.updateTrombinoscopeUser(
      this.data.id,
      this.data.imageUrl,
      this.data.nom,
      this.data.prenom,
      this.data.serment,
      this.data.casePalais,
      this.data.adresse,
      this.data.telephone,
      this.data.email,
    );
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
