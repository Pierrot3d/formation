import { Component } from '@angular/core';

@Component({
  selector: 'app-tabletest',
  templateUrl: './tabletest.component.html',
  styleUrls: ['./tabletest.component.scss']
})
export class TabletestComponent {
   tableau : Tableau[]= [

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
    Avocat: string;
    NbrDeJourDeFormation : number;
    specialite: string;
}

export class Tableau {
  Avocat: string;
  NbrDeJourDeFormation : number;
  specialite: string;
}


  
;
