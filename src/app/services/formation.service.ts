import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

nbrHeuresObligatoires: number


constructor() {
  this.nbrHeuresObligatoires = 20;
}

isFormationObligationSatisfy(element)
{
  if(element.value.group)
  {
    switch(element.value.group)
    {
      case "Mineurs":
      {
       console.log(element)
        return
      }
    case "Pénal":
      {
        console.log(element)
        return
      }
    case "JLD-HO":
      {
        console.log(element)
        return
      }
    case "Déontologie":
      {
        console.log(element)
        return
      }
    case "Spécialisation":
      {
        console.log(element)
        return
      }
    case "Droit des étrangers":
      {
        console.log(element)
        return
      }
    default:
      {
        return
      }
    }
  }
  else
  {
    return
  }
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
    case "Droit des étrangers":
      {
        this.nbrHeuresObligatoires
        return this.nbrHeuresObligatoires
      }
    default:
      {
        return this.nbrHeuresObligatoires;
      }
  }
}


}
