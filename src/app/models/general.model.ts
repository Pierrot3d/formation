export class FormGeneral {
  public nom: string; //nom du batonnier
  public prenom: string; //prenom du batonnier


  constructor(option: FormGeneral) {
    this.nom = option.nom;
    this.prenom = option.prenom;
  }
}
