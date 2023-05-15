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
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires;
      }
    case "Pénal":
      {
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires;
      }
    case "JLD-HO":
      {
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires;
      }
    case "Déontologie":
      {
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires;
      }
    case "Spécialisation":
      {
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires;
      }
    default:
      {
        return this.nbrHeuresObligatoires;
      }
  }
}


}
