import { DialogUpdateTrombinoscopeComponent } from './dialogUpdateTrombinoscope/dialogUpdateTrombinoscope.component';
import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-trombinoscope',
  templateUrl: './trombinoscope.component.html',
  styleUrls: ['./trombinoscope.component.css'],
})
export class TrombinoscopeComponent {

  displayedColumns: string[] = ['imageUrl', 'nom', 'prenom', 'serment', 'case', 'adresse', 'telephone', 'email', 'update', 'trash'];

  dataSource;
  db;
  generalData$;
  sortedGeneralData;
  selectedDate;
  lawyers$;
  numberOfLawyer;
  sortedData;
  dataSortedByUser: Sort;

  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog) {
    const dbGeneral = getDatabase();
    const starCountRefGeneral = ref(dbGeneral, 'general/');
    onValue(starCountRefGeneral, (snapshot) => {
      const data = snapshot.val();
      this.generalData$ = Object.keys(data).map((key) => ({
        type: key,
        value: data[key],
      }));
      this.dataSource = new MatTableDataSource(this.generalData$);
      this.sortedGeneralData = this.generalData$.slice();
      this.bddCommunicationService.batonnier =
        this.sortedGeneralData[0].value.prenom +
        ' ' +
        this.sortedGeneralData[0].value.nom;
      if (data) {
        this.bddCommunicationService.selectedDate =
          this.sortedGeneralData[1].value;
        this.selectedDate = this.bddCommunicationService.selectedDate;

        const db = getDatabase();
        const starCountRef = ref(
          db,
          this.bddCommunicationService.selectedDate + '/avocats/'
        );
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          this.lawyers$ = Object.keys(data).map((key) => ({
            type: key,
            value: data[key],
          }));
          this.dataSource = new MatTableDataSource(this.lawyers$);
          this.numberOfLawyer = this.lawyers$.length;

          this.sortedData = this.lawyers$.slice();
          this.sortedData.sort(this.SortList)

          if (this.dataSortedByUser) {
            this.sortData(this.dataSortedByUser);
          }
        });
      }
    });
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
          return this.compare(
            a.value.formationDayDo,
            b.value.formationDayDo,
            isAsc
          );
        case 'formationHoursReport':
          return this.compare(
            a.value.formationHoursReport,
            b.value.formationHoursReport,
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  SortList(x, y) {
    if (x.value.nom  < y.value.nom) {
      return -1;
    }
    if (x.value.nom > y.value.nom) {
      return 1;
    }
    return 0;
  }

  openUpdateDialog(id, imageUrl, nom, prenom, serment, casePalais, adresse, telephone, email): void {
    const dialogRef = this.dialog.open(DialogUpdateTrombinoscopeComponent, {
      height: "70vh",
      width: "40vw",
      data: {id: id, imageUrl: imageUrl, nom: nom, prenom: prenom, serment: serment, case: casePalais, adresse: adresse, telephone: telephone, email : email},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }
}
