export class Lawyers {
  public type: string
  public value: {
    nom: string,
    prenom: string,
    email: string,
    group: [], // groupe d'appartenance des avocats
    mandatoryHours: number, // nombre d'heure obligatoire
    mandatoryHoursGroup: number, //nombre d'heure obligatoire de groupe
    nbr: number, //nombre d'heure globale
    nbrGroup: number, //nombre d'heure de groupe
  };


  constructor(option: Lawyers) {
    this.type = option.type;
    this.value = option.value;
  }
}
