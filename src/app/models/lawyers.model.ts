export class Lawyers {
  public type: string
  public value: {
    nom: string,
    prenom: string,
    email: string
  };


  constructor(option: Lawyers) {
    this.type = option.type;
    this.value = option.value;
  }
}
