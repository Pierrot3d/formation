import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogOrdreFormationData } from '../formation/formation.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, catchError, map, startWith } from 'rxjs';
import { getDatabase, onValue, push, ref } from '@angular/fire/database';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogAddOrdreFormation',
  templateUrl: './dialogAddOrdreFormation.component.html',
  styleUrls: ['./dialogAddOrdreFormation.component.css']
})
export class DialogAddOrdreFormationComponent  {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  testList;
  $lawyerList;

  lawyerCtrl = new FormControl('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredLawyers: Observable<any>;
  lawyer = [];


  @ViewChild('lawyerInput') lawyerInput: ElementRef<HTMLInputElement>;
  dataSource: any;


  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  constructor(
    public dialogRef: MatDialogRef<DialogAddOrdreFormationComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData,
  ) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.$lawyerList = Object.keys(data).map(key => ({type: key, value: data[key]}))
      // console.log(this.lawyers$)
      this.dataSource = new MatTableDataSource(this.$lawyerList);

      this.filteredLawyers = this.lawyerCtrl.valueChanges.pipe(
        startWith(null),
        map((lawyer: string | null) => (lawyer ? this._filter(lawyer) : this.$lawyerList.slice())),
      );
      // console.log(this.filteredLawyers)
  });
}

  addUser()
  {
    const startTMP = this.changeDateFormat(this.range.value.start);
    const endTMP = this.changeDateFormat(this.range.value.end);

    this.addFormation(this.range.value.start, this.range.value.end)

    const value = {
      formationName: this.data.formationName,
      duration: this.data.duration,
      participant: this.lawyer,
      groupe: this.data.groupe,
      startTMP,
      endTMP,
      nbrParticipant: this.lawyer.length,
      individualFormationId: this.formationId
    }
    this.bddCommunicationService.saveOrdreFormationToServer(value);
  }

  heuresDeGroupe;
  formationId = [];
  addFormation(start, end) {
    const startTMP = this.changeDateFormat(start);
    const endTMP = this.changeDateFormat(end);

    for(const participant of this.lawyer)
    {
     this.formationId.push(this.bddCommunicationService.addFormationBdd(
        participant.type,
        this.data.formationName,
        this.data.groupe? this.data.groupe : "",
        startTMP,
        endTMP,
        0,
        this.data.duration ? this.data.duration : 0,
        this.heuresDeGroupe ? this.heuresDeGroupe : 0,
      ));

      let formationList$: {type, value}[] = [];


      const db = getDatabase();
      const starCountRef = ref(db, 'formation/' + participant.type);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          formationList$ = Object.keys(data).map((key) => ({
            type: key,
            value: data[key],
          }));
          // console.log(this.lawyers$)
          // console.log(formationList$)

          // console.log(formationList$)
          this.bddCommunicationService.sendNewHours(participant.type, formationList$)
        } else {
          formationList$ = [];

          return console.log('pas de formation avec cet utilisateur')
        }
      });

    }

  }

  changeDateFormat(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const jour = date.toISOString().split('T')[0].split('-')[2]
    const mois = date.toISOString().split('T')[0].split('-')[1]
    const annee = date.toISOString().split('T')[0].split('-')[0]
    return jour + '/' + mois + '/'+ annee;
  }

  add(event: MatChipInputEvent): void {
     console.log(event)
    const value = (event.value || '').trim();

    // console.log(value)

    // Add our fruit
    if (value) {
      this.lawyer.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.lawyerCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.lawyer.indexOf(fruit);

    if (index >= 0) {
      this.lawyer.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.lawyer.push(event.option.value);
    this.lawyerInput.nativeElement.value = '';
    this.lawyerCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    const arr = this.$lawyerList || []

    return arr ? arr.filter(lawyer => lawyer.value.nom?.includes(filterValue? filterValue : '')) : [];
  }




  onNoClick(): void {
    this.dialogRef.close();
  }
}
