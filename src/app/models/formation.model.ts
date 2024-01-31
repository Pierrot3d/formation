export class Formation {
  public type: string
  public value: [
    {
      type: string,
      value: {
        end: string,
        formationLabel: string,
        formationType: any,
        numOfDay: number,
        numOfHours: string,
        isHeFormator: boolean,
        numOfGroupHours: any,
        start: string,
      }
    }
  ];


  constructor(option: Formation) {
    this.type = option.type;
    this.value = option.value;
  }
}

