import { Component, ViewChild } from '@angular/core';
import { getDatabase, ref, onValue } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'src/app/components/table/table/table.component';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { FormationService } from 'src/app/services/formation.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { DialogAddOrdreFormationComponent } from '../dialogAddOrdreFormation/dialogAddOrdreFormation.component';
import { DialogInformationParticipantComponent } from '../dialogInformationParticipant/dialogInformationParticipant.component';

export interface DialogOrdreFormationData {
  formationName: string;
  duration: number;
  participant: [];
  groupe: string;
  nbrParticipant: number;
  endTMP;
  startTMP;
}

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})



export class FormationComponent {

  lawyers$
  lawyersList$

  displayedColumns: string[] = ['formationName', 'duration', 'participant', 'trash' ];
  dataSource
  db

  updateUserDataTmp: DialogData;
  sortedData;
  dataSortedByUser: Sort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer, public formationService: FormationService) {
    const db = getDatabase();
    const starCountRef = ref(db, 'formationOrdre/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if(data)
      {


      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      // console.log(this.lawyers$)
      this.dataSource = new MatTableDataSource(this.lawyers$);
      this.sortedData = this.lawyers$.slice()
      if(this.dataSortedByUser)
      {
        this.sortData(this.dataSortedByUser)
      }
    }

    })
  }

    sortData(sort: Sort) {
      const data = this.lawyers$.slice();
      if (!sort.active || sort.direction === '') {
        this.sortedData = data;
        return;
      }
      this.dataSortedByUser = sort;
      this.sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';

        switch (sort.active) {
          case 'nom':
            return this.compare(a.value.nom, b.value.nom, isAsc);
          case 'prenom':
            return this.compare(a.value.prenom, b.value.prenom, isAsc);
          case 'email':
            return this.compare(a.value.email, b.value.email, isAsc);
          case 'group':
            return this.compare(a.value.group, b.value.group, isAsc);
          case 'formationDayDo':
            return this.compare(a.value.formationDayDo, b.value.formationDayDo, isAsc);
          case 'formationHoursReport':
            return this.compare(a.value.formationHoursReport, b.value.formationHoursReport, isAsc);
          default:
            return 0;
        }
      });
    }


compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
}

removeOrdreFormation(element)
{
  for(const participant of element.value.participant)
  {
    for(const formationId of element.value.individualFormationId)
    this.bddCommunicationService.removeFormation(participant.type, formationId)
  }
  this.bddCommunicationService.removeOrdreFormation(element.type)
}

openAddOrdreFormationDialog(): void {
  const dialogRef = this.dialog.open(DialogAddOrdreFormationComponent, {
    height: "80vh",
    width: "80vw",
    data: {id: '', formationName: '', duration: '', participant: ''},
  });



  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    //console.log(result);
  });
}

openInformationParticipantDialog(element): void {
  const dialogRef = this.dialog.open(DialogInformationParticipantComponent, {
    height: "80vh",
    width: "80vw",
    data: {id: element.type, formationName: element.value.formationName, duration: element.value.duration, participant: element.value.participant, startTMP: element.value.startTMP, endTMP: element.value.endTMP},
  });



  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // console.log(result);
  });
}




}
