import { DialogUpdateTrombinoscopeComponent } from './dialogUpdateTrombinoscope/dialogUpdateTrombinoscope.component';
import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ContentService } from 'src/app/services/content.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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

  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private contentService: ContentService) {
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
      height: "100vh",
      width: "40vw",
      data: {id: id, imageUrl: imageUrl, nom: nom, prenom: prenom, serment: serment, case: casePalais, adresse: adresse, telephone: telephone, email : email},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }


  //
  //
  //GESTION PDF
  //
  //

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
