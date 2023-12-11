import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { getDatabase, ref, onValue, push } from '@angular/fire/database';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { FormationService } from 'src/app/services/formation.service';
import { DialogOrdreFormationData } from '../formation/formation.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl,Validators,  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith, catchError, timeout } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogInformationParticipant',
  templateUrl: './dialogInformationParticipant.component.html',
  styleUrls: ['./dialogInformationParticipant.component.css'],
})
export class DialogInformationParticipantComponent {
  OrdreFormation$;

  //displayedColumns: string[] = ['participant', 'trash'];
  displayedColumns: string[] = ['participant', 'attestation'];

  dataSource;
  db;

  sortedData;
  dataTable: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  $lawyerList;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  lawyerCtrl = new FormControl('', [Validators.required]);
  filteredLawyers: Observable<any>;
  lawyer = [];

  @ViewChild('lawyerInput') lawyerInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<DialogInformationParticipantComponent>,
    private bddCommunicationService: BddCommunicationService,
    private contentService: ContentService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData
  ) {
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

    for (const elmnt of this.data.participant) {
      this.dataTable.push(elmnt);
    }

    this.lawyer = this.dataTable;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.lawyer.push(value);
      this.dataTable.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.lawyerCtrl.setValue(null);
  }

  deletedLawyers = [];

  remove(fruit: string): void {
    const index = this.lawyer.indexOf(fruit);
    this.deletedLawyers.push(fruit);
    if (index >= 0) {
      this.lawyer.splice(index, 1);
    }
  }

  removeOrdreFormation(element) {
    console.log(this.deletedLawyers);
    for (const participant of element) {
      for (const formationId of this.data.individualFormationId)
        this.bddCommunicationService.removeFormation(
          participant.type,
          formationId
        );
    }
    for (const participant of this.deletedLawyers) {
      for (const formationId of this.data.individualFormationId)
        this.bddCommunicationService.removeFormation(
          participant.type,
          formationId
        );
    }

    this.bddCommunicationService.removeOrdreFormation(element.type);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    for (const id of this.dataTable) {
      if (id['type'] == event.option.value.type) {
        break;
      } else {
        this.dataTable.push(event.option.value);

        break;
      }
    }

    this.lawyerInput.nativeElement.value = '';
    this.lawyerCtrl.setValue(null);

    for (let i = 0; i < this.$lawyerList.length; i++) {
      if (this.$lawyerList[i].type === event.option.value.type) {
        this.$lawyerList.splice(i, 1);
      }
    }
  }

  formationId = [];
  updateGlobalFormation() {
    this.removeOrdreFormation(this.lawyer);

    //let datasTmp = ""
    // eslint-disable-next-line prefer-const
    /*      for(let datas of this.data.participant)
    {
      console.log(datas)
      if(datas.type == datasTmp)
      {
        console.log("Il y a deux pareil")
      }
      else
      {
        datasTmp = datas.type;
        return
      }
    } */

    this.bddCommunicationService.updateOrdreFormationParticipant(
      this.data.id,
      this.data,
      this.dataTable,
      this.data.individualFormationId,
      this.formationId,
      this.data.startTMP,
      this.data.endTMP
    );
  }

  modifyMode = false;

  modifyModeAction() {
    this.modifyMode = !this.modifyMode;
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

  generatePdf(name, surname, formationName, date, duree, lieu) {
    const document = this.getDocument(
      name,
      surname,
      formationName,
      date,
      duree,
      lieu
    );
    pdfMake.createPdf(document).open();
  }

  getDocument(name, surname, formationName, date, duree, lieu) {
    const logo = this.contentService.logoBase64;
    const signature = this.contentService.signature;

    const docDefinition = {
      content: [
        {
          image: logo,
          width: 60,
        },
        {
          text: 'Attestation de formation',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'ORDRE DES AVOCATS DE TOURS',
          margin: [0, 20, 0, 10],
          style: 'header',
        },
        {
          text:
            'Je soussigné ' +
            this.bddCommunicationService.batonnier +
            ', le Bâtonnier de l’Ordre des Avocats du Barreau de TOURS, atteste de la présence de Maître ' +
            surname +
            ' ' +
            name +
            ' à la Formation décrite ci-après :',
          margin: [0, 20, 0, 10],
        },
        {
          text: 'Formations reçues',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['auto', '*', 'auto', '*'],
            heights: 40,
            body: [
              ['Date', 'Libellé', 'Durée', 'lieu'],
              [date, formationName, duree, lieu],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          columns: [
            [
              {
                text: 'Attestation',
                margin: [0, 20, 0, 0],
                style: 'name',
              },
              {
                text: this.bddCommunicationService.batonnier,
              },
              {
                image: signature,
                width: 80,
              },
            ],
          ],
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

  generateGlobalPdf(datas, formationName, date, duree, lieu) {
    const document = this.getGlobalDocument(
      datas,
      formationName,
      date,
      duree,
      lieu
    );
    pdfMake.createPdf(document).open();
  }

  getGlobalDocument(datas, date, formationName, duree, lieu) {
    const tables = [];
    const logo = this.contentService.logoBase64;
    const signature = this.contentService.signature


    for (const data of datas) {
      tables.push(
        {
          image: logo,
          width: 60,
        },
        {
          text: 'Attestation de formation',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'ORDRE DES AVOCATS DE TOURS',
          margin: [0, 20, 0, 10],
          style: 'header',
        },
        {
          text:
            'Je soussigné ' +
            this.bddCommunicationService.batonnier +
            ', le Bâtonnier de l’Ordre des Avocats du Barreau de TOURS, atteste de la présence de Maître ' +
            data.value.prenom +
            ' ' +
            data.value.nom +
            ' à la Formation décrite ci-après :',
          margin: [0, 20, 0, 10],
        },
        {
          text: 'Formations reçues',
          margin: [0, 10, 0, 10],
          style: 't1',
        },
        {
          table: {
            widths: ['auto', '*', 'auto', '*'],
            heights: 40,
            body: [
              ['Date', 'Libellé', 'Durée', 'lieu'],
              [date, formationName, duree, lieu],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        {
          columns: [
            [
              {
                text: 'Attestation',
                margin: [0, 20, 0, 0],
                style: 'name',
              },
              {
                text: this.bddCommunicationService.batonnier,
              },
              {
                image: signature,
                width: 80,
                pageBreak: 'after'
              },
            ],
          ],
        },
      );}
        console.log(tables)
      const docDefinition = {
        content: [ tables ],
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
}
