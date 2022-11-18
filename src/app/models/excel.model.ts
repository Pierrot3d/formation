export class FormExcel {
  public nom: string;
  public prenom: string;
  public email: string;
  public cocktail: boolean;
  public brunch: boolean;
  public restrictionAlimentaires: string;

  constructor(option: FormExcel) {
    this.nom = option.nom;
    this.prenom = option.prenom;
    this.email = option.email;
    this.cocktail = option.cocktail;
    this.brunch = option.brunch;
    this.restrictionAlimentaires = option.restrictionAlimentaires;
  }
}
