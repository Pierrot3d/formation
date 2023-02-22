import { Component } from '@angular/core';
import { PauseOutlined } from '@material-ui/icons';

@Component({
  selector: 'app-tabletest',
  templateUrl: './tabletest.component.html',
  styleUrls: ['./tabletest.component.scss']
})
export class TabletestComponent {

}

type classeAttestation = Array<{Avocat: string, NbrDeJourDeFormation : number, specialite : string }>;

const attestation: classeAttestation = [
  {
    Avocat : 'personne 1' ,
    NbrDeJourDeFormation : 6,
    specialite : 'true'
  },
  {
    Avocat : 'personne 2' ,
    NbrDeJourDeFormation : 4,
    specialite : 'true'
  },
  {
    Avocat : 'personne 3',
    NbrDeJourDeFormation : 3,
    specialite : 'false'

  },
  {
    Avocat : 'personne 4',
    NbrDeJourDeFormation : 6,
    specialite : 'false'
  }

]

