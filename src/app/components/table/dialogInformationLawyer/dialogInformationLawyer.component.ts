/* eslint-disable @angular-eslint/component-selector */
import { BddCommunicationService } from './../../../services/bdd-communication.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { ContentService } from 'src/app/services/content.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dialogInformationLawyer',
  templateUrl: './dialogInformationLawyer.component.html',
  styleUrls: ['./dialogInformationLawyer.component.css'],
})
export class DialogInformationLawyerComponent {
  displayedColumns: string[] = [
    'formation',
    'type',
    'date',
    'nbrHours',
    'nbrHoursGroup',
    'isHeFormator',
    'trash',
    'update',
    'total',
  ];
  dataTmp: any;
  nbrJour: number;
  formationList$;
  sortedData;
  dataSource;
  modifyMode: boolean;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  updateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    public dialogRef: MatDialogRef<DialogInformationLawyerComponent>,
    private bddCommunicationService: BddCommunicationService,
    private contentService: ContentService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.modifyMode = false;
    this.dataTmp = [data];

    const db = getDatabase();
    const starCountRef = ref(db, 'formation/' + this.data.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.formationList$ = Object.keys(data).map((key) => ({
          type: key,
          value: data[key],
        }));
        // console.log(this.lawyers$)
        this.dataSource = new MatTableDataSource(this.formationList$);
        this.sortedData = this.formationList$.slice();
      } else {
        this.formationList$ = [];
      }
    });
  }

  modifyModeFn(element)
  {
    element.value.modifyMode = true
  }

  modified(element)
  {

    element.value.modifyMode = false
    this.bddCommunicationService.updateFormationBdd(
      this.data.id,
      element.value.formationLabel,
      element.value.formationType? element.value.formationType : "",
      element.value.start,
      element.value.end,
        0,
        element.value.numOfHours ? element.value.numOfHours : 0,
        element.value.numOfGroupHours ? element.value.numOfGroupHours : 0,
        element.type,
        element.value.isHeFormator ? element.value.isHeFormator : false
    )
  }

  removeFormation(id, elemnt) {
    console.log(id, elemnt);
    this.bddCommunicationService.removeFormation(id, elemnt);
  }

  addFormation(start, end) {
    const startTMP = this.changeDateFormat(start);
    const endTMP = this.changeDateFormat(end);

    this.bddCommunicationService.addFormationBdd(
      this.data.id,
      this.data.formationLabel,
      this.data.formationType? this.data.formationType : "",
      startTMP,
      endTMP,
      0,
      this.data.numOfHours ? this.data.numOfHours : 0,
      this.data.numOfGroupHours ? this.data.numOfGroupHours : 0,
      this.data.isHeFormator ? this.data.isHeFormator : false,
      this.data.formation?.id,
    );
  }

  changeDateFormat(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const jour = date.toISOString().split('T')[0].split('-')[2]
    const mois = date.toISOString().split('T')[0].split('-')[1]
    const annee = date.toISOString().split('T')[0].split('-')[0]
    return jour + '/' + mois + '/'+ annee;
  }

  nbrDeJours(d1?, d2?) {
    if (d1 && d2) {
      const WNbJours = d2.getTime() - d1.getTime();
      return Math.ceil(WNbJours / (1000 * 60 * 60 * 24));
    } else {
      return 0;
    }
  }

  numOfDates: number;

  getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    this.numOfDates = count;
    return count;
  }

  sendNewJour() {
    let nbrDayTmp: number;
    nbrDayTmp = 0;

    for (let i = 0; i < this.formationList$.length; i++) {
      nbrDayTmp = nbrDayTmp + this.formationList$[i].value.numOfDay;
    }

    this.bddCommunicationService.updateNbrDay(this.data.id, nbrDayTmp);
  }

  sendNewHours() {
    console.log(this.formationList$)
    this.bddCommunicationService.sendNewHours(this.data.id, this.formationList$)
    this.bddCommunicationService.sendNewGroupHours(this.data.id, this.formationList$)
/*     let nbrHoursTmp: number;
    nbrHoursTmp = 0;

    for (let i = 0; i < this.formationList$.length; i++) {
      console.log(nbrHoursTmp, '+', this.formationList$[i].value.numOfHours);
      nbrHoursTmp = nbrHoursTmp + +this.formationList$[i].value.numOfHours;
    }
    console.log(nbrHoursTmp);
    this.bddCommunicationService.updateNbrHours(this.data.id, nbrHoursTmp); */
  }



 generatePdf(formationsList)
{
let lawyersNameTableTmp = [];
  for(const part of formationsList)
  {
    const lawyerTableTmp = {
      Date: part.value.start,
      Libellé: part.value.formationLabel,
      Heures: part.value.numOfHours,
    }

    lawyersNameTableTmp.push(lawyerTableTmp)
  }

  console.log(lawyersNameTableTmp)
  lawyersNameTableTmp = lawyersNameTableTmp.sort((a, b) => (a.Nom > b.Nom ? 1 : -1))

  const document = this.getDocument(lawyersNameTableTmp, ['Date', 'Libellé', 'Heures']);
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
  console.log(body)

  return body;
}

getDocument(formationName, column)
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
      text: name,
      margin: [ 0, 10, 0, 10 ],
      style: 'formation'
    },
    {
			table: {
        widths: ['*', 'auto'],
        heights: 40,
				body: [
          ['OBLIGATION', 'Heures'],
          ['Obligation horaire', '20'],
          ['Obligation suite à ajustement: Motif: ', ' ']
        ]
			},
      layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex === 0) ? '#CCCCCC' : null;
				}
			}
		},
    {
      text: 'Avocat : ' + this.data.nom + ' ' + this.data.prenom,
      margin: [ 0, 10, 0, 10 ],
      style: 't1'
    },
    {
			table: {
        //widths: ['auto', '*'],
        heights: 40,
				body: this.buildTableBody(formationName, column)
			},
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex === 0) ? '#CCCCCC' : null;
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
