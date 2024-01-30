import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
  styleUrls: ['./dialogAddOrdreFormation.component.css'],
})
export class DialogAddOrdreFormationComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  testList;
  $lawyerList;

  lawyerCtrl = new FormControl('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredLawyers: Observable<any>;
  lawyer = [];

  @ViewChild('lawyerInput') lawyerInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList;

  dataSource: any;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    public dialogRef: MatDialogRef<DialogAddOrdreFormationComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData
  ) {


    const dbGeneral = getDatabase();
    const starCountRefGeneral = ref(dbGeneral, 'general/');
    onValue(starCountRefGeneral, (snapshot) => {
      const data = snapshot.val();
      if(data)
      {
        const db = getDatabase();
        const starCountRef = ref(db, 'avocats/');
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          this.$lawyerList = Object.keys(data).map((key) => ({
            type: key,
            value: data[key],
          }));
          this.dataSource = new MatTableDataSource(this.$lawyerList);

          this.filteredLawyers = this.lawyerCtrl.valueChanges.pipe(
            startWith(null),
            map((lawyer: string | null) =>
              lawyer ? this._filter(lawyer) : this.$lawyerList.slice()
            )
          );
        });
      }
    })
  }

  addGlobalFormation() {
    const startTMP = this.changeDateFormat(this.range.value.start);
    const endTMP = this.changeDateFormat(this.range.value.end);

    this.bddCommunicationService.addOrdreFormation(
      this.range,
      this.data,
      this.lawyer,
      this.formationId,
      startTMP,
      endTMP,
      this.heuresDeGroupe
    );
  }

  heuresDeGroupe;
  formationId = [];

  changeDateFormat(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const jour = date.toISOString().split('T')[0].split('-')[2];
    const mois = date.toISOString().split('T')[0].split('-')[1];
    const annee = date.toISOString().split('T')[0].split('-')[0];
    return jour + '/' + mois + '/' + annee;
  }

  /*   add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log("c'est add")
    // Add our fruit
    if (value) {
      console.log(value)
      this.lawyer.push(value);
      console.log(this.lawyer)
          // Clear the input value
    event.chipInput!.clear();

    this.lawyerCtrl.setValue(null);
    }
    else
    {
      this.chipList.errorState = true;
    }


  } */

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
      for(let i = 0; i < this.$lawyerList.length;  i++)
      {
        if(this.$lawyerList[i].type === event.option.value.type)
        {
          this.$lawyerList.splice(i, 1);
        }
      }
    }

  private _filter(value: string): string[] {
    const filterValue = value;
    const arr = this.$lawyerList || [];

    return arr
      ? arr.filter((lawyer) =>
          lawyer.value.nom?.includes(filterValue ? filterValue : '')
        )
      : [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
