export class FormationOrdre {
  public type: string
  public value: {
    duration: string,
    formationName: string,
    individualFormationId: [],
    nbrParticipant: number,
    participant: [
      {
        type: string,
        value:
        {
          email: string,
          group: [],
          mandatoryHours: number,
          mandatoryHoursGroup: number,
          nom: string,
          prenom: string,
        }
      }
    ],
  };


  constructor(option: FormationOrdre) {
    this.type = option.type;
    this.value = option.value;
  }
}
