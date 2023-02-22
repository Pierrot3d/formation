export class Lawyers {
  public type: string
  public value: {
    nom: string,
    prenom: string,
    email: string,
    group: string,
  };


  constructor(option: Lawyers) {
    this.type = option.type;
    this.value = option.value;
  }
}
