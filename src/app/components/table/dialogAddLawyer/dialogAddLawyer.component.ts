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

  isGroupParticularity(element)
  {
    let mandatoryHoursGroupTmp = 0

    if(Array.isArray(element))
    {

    for(let i=0; i < element.length; i++)
    {

    switch(element[i])
    {
      case "Mineurs":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 7;
          break
        }
      case "Pénal":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 7;
          break
        }
      case "JLD-HO":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 3;
          break
        }
      case "Déontologie":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 10;
          break
        }
      case "Spécialisation":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 10;
          break
        }
      case "Droit des étrangers":
        {
          mandatoryHoursGroupTmp = mandatoryHoursGroupTmp + 10;
          break
        }
      default:
        {
          return 0
        }
      }
    }
    return mandatoryHoursGroupTmp;
  }
  else
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
      case "Droit des étrangers":
        {
          return 10;
        }
      default:
        {
          return 0
        }
    }
  }
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}

