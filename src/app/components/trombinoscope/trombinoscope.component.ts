import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-trombinoscope',
  templateUrl: './trombinoscope.component.html',
  styleUrls: ['./trombinoscope.component.css'],
})
export class TrombinoscopeComponent {
  dataSource;
  db;
  generalData$;
  sortedGeneralData;
  selectedDate;
  lawyers$;
  numberOfLawyer;
  sortedData;
  dataSortedByUser;

  constructor(public bddCommunicationService: BddCommunicationService) {
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
}
