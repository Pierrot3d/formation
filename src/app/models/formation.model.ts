export class Formation {
  public type: string
  public value: [
    {
      type: string,
      value: {
        end: string,
        formationLabel: string,
        numOfDay: number,
        numOfHours: string,
        start: string,
      }
    }
  ];


  constructor(option: Formation) {
    this.type = option.type;
    this.value = option.value;
  }
}

