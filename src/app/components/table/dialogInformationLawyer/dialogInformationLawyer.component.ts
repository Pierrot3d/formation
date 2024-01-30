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
  ajustHourMode = false;
  adjustHourTable = {
    nbrAdjustHour: '',
    motifAdjustHour: '',
  };

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

    const dbGeneral = getDatabase();
    const starCountRefGeneral = ref(dbGeneral, 'general/');
    onValue(starCountRefGeneral, (snapshot) => {
      const data = snapshot.val();
      if(data)
      {
        this.modifyMode = false;
    this.dataTmp = [data];

    const db = getDatabase();
    const starCountRef = ref(db, this.bddCommunicationService.selectedDate + '/formation/' + this.data.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.formationList$ = Object.keys(data).map((key) => ({
          type: key,
          value: data[key],
        }));
        this.dataSource = new MatTableDataSource(this.formationList$);
        this.sortedData = this.formationList$.slice();
      } else {
        this.formationList$ = [];
      }
    });

    if(this.data.reportableHours)
    {
      if (!(this.data.reportableHours == this.data.nbr - this.data.mandatoryHours)) {
        this.bddCommunicationService.updateReportableHours(
          this.data.id,
          this.data.nbr - this.data.mandatoryHours
        );
      }
    }
    else {
      this.bddCommunicationService.updateReportableHours(
        this.data.id,
        this.data.nbr - this.data.mandatoryHours
      );
      this.data.reportableHours = this.data.nbr - this.data.mandatoryHours
  }

      }
    })




  }

  modifyModeFn(element) {
    element.value.modifyMode = true;
  }

  modified(element) {
    element.value.modifyMode = false;
    this.bddCommunicationService.updateFormationBdd(
      this.data.id,
      element.value.formationLabel,
      element.value.formationType ? element.value.formationType : '',
      element.value.start,
      element.value.end,
      0,
      element.value.numOfHours ? element.value.numOfHours : 0,
      element.value.numOfGroupHours ? element.value.numOfGroupHours : 0,
      element.type,
      element.value.isHeFormator ? element.value.isHeFormator : false
    );
  }

  removeFormation(id, elemnt) {
    this.bddCommunicationService.removeFormation(id, elemnt);
  }

  addFormation(start, end) {
    const startTMP = this.changeDateFormat(start);
    const endTMP = this.changeDateFormat(end);

    this.bddCommunicationService.addFormationBdd(
      this.data.id,
      this.data.formationLabel,
      this.data.formationType ? this.data.formationType : '',
      startTMP,
      endTMP,
      0,
      this.data.numOfHours ? this.data.numOfHours : 0,
      this.data.numOfGroupHours ? this.data.numOfGroupHours : 0,
      this.data.isHeFormator ? this.data.isHeFormator : false,
      this.data.formation?.id
    );
  }

  changeDateFormat(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const jour = date.toISOString().split('T')[0].split('-')[2];
    const mois = date.toISOString().split('T')[0].split('-')[1];
    const annee = date.toISOString().split('T')[0].split('-')[0];
    return jour + '/' + mois + '/' + annee;
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
    this.bddCommunicationService.sendNewHours(
      this.data.id,
      this.formationList$
    );
    this.bddCommunicationService.sendNewGroupHours(
      this.data.id,
      this.formationList$
    );
  }

  ajustFn() {
    this.ajustHourMode = !this.ajustHourMode;
  }

  saveAjustFn(nbrAdjustHour, motifAdjustHour) {
    this.ajustHourMode = !this.ajustHourMode;

    this.bddCommunicationService.updateAdjustementHour(
      this.data.id,
      nbrAdjustHour,
      motifAdjustHour
    );
  }

  generatePdf(formationsList) {
    let lawyersNameTableTmp = [];

    for (const part of formationsList) {
      const lawyerTableTmp = {
        Date: part.value.start,
        Libellé: part.value.formationLabel,
        Heures: part.value.numOfHours,
        isHeFormator: part.value.isHeFormator? part.value.isHeFormator : false
      };

      lawyersNameTableTmp.push(lawyerTableTmp);
    }

    lawyersNameTableTmp = lawyersNameTableTmp.sort((a, b) =>
      a.Nom > b.Nom ? 1 : -1
    );

    const document = this.getDocument(lawyersNameTableTmp, [
      'Date',
      'Libellé',
      'Heures',
    ], [
      'Date',
      'Libellé',
      'Heures',
      'Comptabilisées'
    ]);
    pdfMake.createPdf(document).open();
  }

  buildTableBody(data, columns) {
    const body = [];

    body.push(columns);
    data.forEach(function (row) {
      if(!row.isHeFormator)
      {
        const dataRow = [];

        columns.forEach(function (column) {
          dataRow.push(row[column].toString());
        });

        body.push(dataRow);
      }
    });

    return body;
  }

  buildGaveFormationTableBody(data, columns) {
    const body = [];

    body.push(columns);
    data.forEach(function (row) {
      if(row.isHeFormator)
      {
        const dataRow = [];
        row.Comptabilisées = row.Heures*4
        console.log(row)
        columns.forEach(function (column) {
          dataRow.push(row[column].toString());
        });

        body.push(dataRow);
      }
    });

    return body;
  }

  getDocument(formationName, column, columnDispense) {
    const logo = this.contentService.logoBase64;
    let mandatoryhoursAdjust: number;
    if(this.data.nbrAdjustHour)
    {
      mandatoryhoursAdjust = this.data.mandatoryHours - this.data.nbrAdjustHour
    }

    const docDefinition = {
      content: [
        {
          image: logo,
          width: 60,
        },
        {
          text: 'ORDRE DES AVOCATS DE TOURS',
          margin: [0, 20, 0, 10],
          style: 'header',
        },
        {
          text: 'Relevé de formation continue ' + this.bddCommunicationService.selectedDate,
          margin: [0, 20, 0, 10],
          style: 't1',
        },
        {
          text: name,
          margin: [0, 10, 0, 10],
          style: 'formation',
        },
        {
          text: 'Avocat : ' + this.data.nom + ' ' + this.data.prenom,
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['*', 'auto'],
            heights: 40,
            body: [
              ['OBLIGATION', 'Heures'],
              ['Obligation horaire', this.data.mandatoryHours],
              [
                'Ajustement d’obligation horaire : ',
                this.data.nbrAdjustHour ? this.data.nbrAdjustHour : '',
              ],
              [
                {
                  text: this.data.motifAdjustHour
                    ? 'Motif : ' + this.data.motifAdjustHour
                    : 'Motif : ',
                  colSpan: 2,
                },
              ],
              [
                'Obligation suite à ajustement : ',
                this.data.nbrAdjustHour
                  ? this.data.mandatoryHours - this.data.nbrAdjustHour
                  : '',
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          text: 'Formations reçues',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['auto', '*', 'auto'],
            heights: 40,
            body: this.buildTableBody(formationName, column),
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          text: 'Formations dispensées',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto'],
            heights: 40,
            body: this.buildGaveFormationTableBody(formationName, columnDispense),
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          text: 'Publications',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['*', '*', '*'],
            heights: 40,
            body: [[' ', ' ', ' ']],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          text: 'Récapitulatif',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['*', 'auto'],
            heights: 40,
            body: [
              [
                'Report issu de l’exercice précédent :',
                this.data.nbrReport ? this.data.nbrReport : '',
              ],
              ['Report sur l’exercice suivant :', mandatoryhoursAdjust? ((this.data.nbr - mandatoryhoursAdjust) > 0? (this.data.nbr - mandatoryhoursAdjust) : '' ) : (this.data.reportableHours > 0 ? this.data.reportableHours : '')],
              ["Déficit d'heures :", mandatoryhoursAdjust? (this.data.nbr - mandatoryhoursAdjust < 0 ? this.data.nbr - mandatoryhoursAdjust : '') : (this.data.reportableHours < 0 ? this.data.reportableHours : '')],
              ['Total général :', this.data.nbr],
              [
                'Obligation : ',
                mandatoryhoursAdjust? (this.data.nbr >= mandatoryhoursAdjust
                ? 'Satisfaite'
                : 'Non satisfaite') : (this.data.nbr >= this.data.mandatoryHours
                  ? 'Satisfaite'
                  : 'Non satisfaite'),
              ],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          alignment: 'center',
          bold: true,
        },
        t1: {
          fontSize: 14,
          alignment: 'center',
          bold: true,
        },
        formation: {
          fontSize: 14,
          alignment: 'center',
        },
      },
    };

    return docDefinition;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
