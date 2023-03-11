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
      NbrDeJourDeFormation : 8,
      specialite : 'Mineurs'
    },
    {
      Avocat : 'personne 2' ,
      NbrDeJourDeFormation : 6,
      specialite : 'Mineurs'
    },
    {
      Avocat : 'personne 3' ,
      NbrDeJourDeFormation : 9,
      specialite : 'Pénal'
    },
    {
      Avocat : 'personne 4' ,
      NbrDeJourDeFormation : 4,
      specialite : 'Pénal'
    },
    {
      Avocat : 'personne 5',
      NbrDeJourDeFormation : 2,
      specialite : 'JLD-HO'
    },
    {
      Avocat : 'personne 6',
      NbrDeJourDeFormation : 4,
      specialite : 'JLD-HO'
    },
    {
      Avocat : 'personne 7',
      NbrDeJourDeFormation : 6,
      specialite : 'jeunes avocats'
    },
    {
      Avocat : 'personne 8',
      NbrDeJourDeFormation : 11,
      specialite : 'jeunes avocats'
    },
    {
      Avocat : 'personne 9',
      NbrDeJourDeFormation : 11,
      specialite : 'avocats spécialisés'
    },
    {
      Avocat : 'personne 10',
      NbrDeJourDeFormation : 6,
      specialite : 'avocats spécialisés'
    },
    

    ]

}

export class Tableau {
  Avocat: string;
  NbrDeJourDeFormation : number;
  specialite: string;
}



  

