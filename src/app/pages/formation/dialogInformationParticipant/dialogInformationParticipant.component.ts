import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { getDatabase, ref, onValue, push } from '@angular/fire/database';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { FormationService } from 'src/app/services/formation.service';
import { DialogOrdreFormationData } from '../formation/formation.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, map, startWith, catchError } from 'rxjs';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogInformationParticipant',
  templateUrl: './dialogInformationParticipant.component.html',
  styleUrls: ['./dialogInformationParticipant.component.css']
})
export class DialogInformationParticipantComponent {

  OrdreFormation$

  displayedColumns: string[] = ['participant', 'trash' ];
  dataSource
  db

  sortedData;
  dataTable: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  $lawyerList
  separatorKeysCodes: number[] = [ENTER, COMMA];
  lawyerCtrl = new FormControl('');
  filteredLawyers: Observable<any>;
  lawyer = [];

  @ViewChild('lawyerInput') lawyerInput: ElementRef<HTMLInputElement>;



  constructor( public dialogRef: MatDialogRef<DialogInformationParticipantComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData){

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
      console.log(this.filteredLawyers)
  });

      console.log(this.data)

      for(const elmnt of this.data.participant)
      {
        this.dataTable.push(elmnt)

      }

      this.lawyer = this.dataTable
      console.log(this.bddCommunicationService.liste)
    }

    add(event: MatChipInputEvent): void {
      console.log(event)
      const value = (event.value || '').trim();

      console.log(value)

      // Add our fruit
      if (value) {
        console.log('ATTTTTTEEEENNNTTIIIOOONN')
        console.log(this.lawyer)
        console.log(this.dataTable)
        this.lawyer.push(value);
        this.dataTable.push(value)
      }

      // Clear the input value
      event.chipInput!.clear();

      this.lawyerCtrl.setValue(null);
    }


    deletedLawyers = []

    remove(fruit: string): void {
      const index = this.lawyer.indexOf(fruit);
      console.log(fruit)
      this.deletedLawyers.push(fruit)
      if (index >= 0) {
        this.lawyer.splice(index, 1);
      }
      console.log(this.deletedLawyers)

    }

    removeOrdreFormation(element)
{
  for(const participant of element)
  {
    for(const formationId of this.data.individualFormationId)
    this.bddCommunicationService.removeFormation(participant.type, formationId)
  }
  this.bddCommunicationService.removeOrdreFormation(element.type)
}

    selected(event: MatAutocompleteSelectedEvent): void {
      for(const id of this.dataTable)
      {
        if(id['type'] == event.option.value.type)
        {
          break
        }
        else
        {
          this.dataTable.push(event.option.value)
          //this.lawyer.push(event.option.value);

          console.log('nouveau', this.dataTable)
          break
        }
      }

      this.lawyerInput.nativeElement.value = '';
      this.lawyerCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
      const filterValue = value;
      return this.$lawyerList.filter(fruit => fruit.value.nom.includes(filterValue)
        );
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }


