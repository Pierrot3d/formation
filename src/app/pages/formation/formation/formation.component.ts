import { ContentService } from 'src/app/services/content.service';
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface DialogOrdreFormationData {
  formationName: string;
  duration: number;
  lieu: string;
  participant: any[];
  groupe: string;
  id: string;
  nbrParticipant: number;
  endTMP;
  startTMP;
  individualFormationId: [];
}

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})



export class FormationComponent {

  lawyers$
  lawyersList$

  displayedColumns: string[] = ['formationName', 'duration', 'lieu', 'participant', 'update', 'attestation', 'trash' ];
  dataSource
  db

  updateUserDataTmp: DialogData;
  sortedData;
  dataSortedByUser: Sort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer, public formationService: FormationService, private contentService: ContentService) {


    const dbGeneral = getDatabase();
    const starCountRefGeneral = ref(dbGeneral, 'general/');
    onValue(starCountRefGeneral, (snapshot) => {
      const data = snapshot.val();
      if(data)
      {
        const db = getDatabase();
        const starCountRef = ref(db, this.bddCommunicationService.selectedDate + '/formationOrdre/');
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          if(data)
          {
          this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
         //console.log(this.lawyers$)
          this.dataSource = new MatTableDataSource(this.lawyers$);
          this.sortedData = this.lawyers$.slice()
          if(this.dataSortedByUser)
          {
            this.sortData(this.dataSortedByUser)
          }
        }
        else
        {
          this.lawyers$ = {}
          this.sortedData = []
        }

        })
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
    data: {id: '', formationName: '', lieu: '', duration: '', participant: ''},
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
    data: {id: element.type, formationName: element.value.formationName, lieu: element.value.lieu, duration: element.value.duration, participant: element.value.participant, startTMP: element.value.startTMP, endTMP: element.value.endTMP, individualFormationId: element.value.individualFormationId, groupe: element.value.groupe},
  });



  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // console.log(result);
  });
}

generatePdf(participant, date, formationName, lieu)
{
  let lawyersNameTableTmp = [];
  for(const part of participant)
  {
    const lawyerTableTmp = {
      Nom: part.value.nom + ' ' + part.value.prenom,
      Signature: ' '
    }

    lawyersNameTableTmp.push(lawyerTableTmp)
  }

  lawyersNameTableTmp = lawyersNameTableTmp.sort((a, b) => (a.Nom > b.Nom ? 1 : -1))

  const document = this.getDocument(lawyersNameTableTmp, ['Nom', 'Signature'], date, formationName, lieu);
  pdfMake.createPdf(document).open();
}


buildTableBody(data, columns) {
  const body = [];

  body.push(columns);

  data.forEach(function(row) {
      const dataRow = [];

      columns.forEach(function(column) {
          dataRow.push(row[column].toString());
      })

      body.push(dataRow);
  });

  return body;
}

getDocument(participant, column, date, formationName, lieu)
{

  const logo = this.contentService.logoBase64

  const docDefinition =

  { content:
    [
    {
      image: logo,
      width: 60
    },
    {
      text: 'ORDRE DES AVOCATS DE TOURS',
      margin: [ 0, 20, 0, 10 ],
      style: 'header'
    },
    {
      text: formationName,
      margin: [ 0, 10, 0, 10 ],
      style: 'formation'
    },
    {
      text: lieu,
      margin: [ 0, 10, 0, 10 ],
      style: 't1'
    },
    {
      text: date,
      margin: [ 0, 10, 0, 10 ],
      style: 't1'
    },
    {
			table: {
        widths: ['auto', '*'],
        heights: 40,
				body: this.buildTableBody(participant, column)
			},
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
			}
		},

  ],
styles:
{
  header:
  {
    fontSize: 18,
    alignment: 'center',
    bold: true
  },
  t1:
  {
    fontSize: 14,
    alignment: 'center',
    bold: true
  },
  formation:
  {
    fontSize: 14,
    alignment: 'center',
  }
}

}

  return docDefinition

}



}
