export class FormExcel {
  public nom: string;
  public prenom: string;
  public email: string;


  constructor(option: FormExcel) {
    this.nom = option.nom;
    this.prenom = option.prenom;
    this.email = option.email;
  }
}
