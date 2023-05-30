import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogOrdreFormationData } from '../formation/formation.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable, catchError, map, startWith } from 'rxjs';
import { getDatabase, onValue, ref } from '@angular/fire/database';
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
  $lawyerList

  lawyerCtrl = new FormControl('');
  filteredLawyers: Observable<any>;
  lawyer = [];

  @ViewChild('lawyerInput') lawyerInput: ElementRef<HTMLInputElement>;
  dataSource: any;


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
        map((lawyer: string | null) => (lawyer ? this._filter(lawyer) : this.$lawyerList
        .slice())),
      );
      console.log(this.filteredLawyers)
  });
}

  addUser()
  {
    console.log(this.lawyer)
    const value = {
      formationName: this.data.formationName,
      duration: this.data.duration,
      participant: this.lawyer,
      groupe: this.data.groupe,
      nbrParticipant: this.lawyer.length
    }
    this.bddCommunicationService.saveOrdreFormationToServer(value);
  }

  add(event: MatChipInputEvent): void {
    console.log(event)
    const value = (event.value || '').trim();

    console.log(value)

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
    console.log(event)
    this.lawyer.push(event.option.value);
    this.lawyerInput.nativeElement.value = '';
    this.lawyerCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value;

    return this.$lawyerList;
  }




  onNoClick(): void {
    this.dialogRef.close();
  }
}
