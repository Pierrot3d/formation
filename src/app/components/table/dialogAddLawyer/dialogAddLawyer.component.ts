import { BddCommunicationService } from './../../../services/bdd-communication.service';
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
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}


  addUser()
  {
    const value = {
      prenom: this.data.prenom,
      nom: this.data.nom,
      email: this.data.email,
      group: this.data.group? this.data.group: "",
      mandatoryHours: 20,
      mandatoryHoursGroup: this.data.group? this.isGroupParticularity(this.data.group): 0
    }
    this.bddCommunicationService.saveLawyersToServer(value);
    this.bddCommunicationService.getLawyersFromServer();
  }

  isGroupParticularity(element: string)
{

  switch(element)
  {
    case "Mineurs":
      {
        return 7;
      }
    case "Pénal":
      {
        return 7;
      }
    case "JLD-HO":
      {
        return 3;
      }
    case "Déontologie":
      {
        return 10;
      }
    case "Spécialisation":
      {
        return 10;
      }
    default:
      {
        return 0
      }
  }
}



  onNoClick(): void {
    this.dialogRef.close();
  }
}

