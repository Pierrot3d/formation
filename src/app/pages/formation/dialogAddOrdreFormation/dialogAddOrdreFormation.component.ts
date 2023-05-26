import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogOrdreFormationData } from '../formation/formation.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogAddOrdreFormation',
  templateUrl: './dialogAddOrdreFormation.component.html',
  styleUrls: ['./dialogAddOrdreFormation.component.css']
})
export class DialogAddOrdreFormationComponent  {

  constructor(
    public dialogRef: MatDialogRef<DialogAddOrdreFormationComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData,
  ) {}


  addUser()
  {
    const value = {
      formationName: this.data.formationName,
      duration: this.data.duration,
      participant: this.data.participant,
      nbrParticipant: this.data.participant.length
    }
    this.bddCommunicationService.saveOrdreFormationToServer(value);
  }




  onNoClick(): void {
    this.dialogRef.close();
  }
}
