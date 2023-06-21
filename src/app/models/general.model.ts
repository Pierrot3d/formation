export class FormGeneral {
  public nom: string; //nom du batonnier
  public prenom: string; //prenom du batonnier
  public id: string;


  constructor(option: FormGeneral) {
    this.nom = option.nom;
    this.prenom = option.prenom;
    this.id = option.id;
  }
}
