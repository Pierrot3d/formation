import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

nbrHeuresObligatoires: number


constructor() {
  this.nbrHeuresObligatoires = 20;
}

isGroupParticularity(element: string)
{
  this.nbrHeuresObligatoires = 20

  switch(element)
  {
    case "Mineurs":
      {
        this.nbrHeuresObligatoires = this.nbrHeuresObligatoires + 7
        return this.nbrHeuresObligatoires;
      }
    case "Pénal":
      {
        this.nbrHeuresObligatoires = this.nbrHeuresObligatoires + 7
        return this.nbrHeuresObligatoires;
      }
    case "JLD-HO":
      {
        this.nbrHeuresObligatoires = this.nbrHeuresObligatoires + 3
        return this.nbrHeuresObligatoires;
      }
    case "Déontologie":
      {
        this.nbrHeuresObligatoires = this.nbrHeuresObligatoires + 10
        return this.nbrHeuresObligatoires;
      }
    case "Spécialisation":
      {
        this.nbrHeuresObligatoires = this.nbrHeuresObligatoires + 10
        return this.nbrHeuresObligatoires;
      }
    default:
      {
        return this.nbrHeuresObligatoires;
      }
  }
}


}
