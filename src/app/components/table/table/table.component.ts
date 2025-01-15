import { DialogInformationLawyerComponent } from './../dialogInformationLawyer/dialogInformationLawyer.component';
import { BddCommunicationService } from "src/app/services/bdd-communication.service";
import { Component, ViewChild } from '@angular/core';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";
import {MatDialog } from '@angular/material/dialog';
import { DialogAddLawyerComponent } from '../dialogAddLawyer/dialogAddLawyer.component';
import { DialogUpdateLawyerComponent } from '../dialogUpdateLawyer/dialogUpdateLawyer.component';
import { DialogExcelComponent } from "../../excel/dialogExcel/dialogExcel.component";
import {MatTableDataSource} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Sort} from '@angular/material/sort';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FormationService } from "src/app/services/formation.service";
import { ContentService } from 'src/app/services/content.service';


export interface DialogData {
  email: string;
  nom: string;
  prenom: string;
  group: string;
  id: string;
  mandatoryHours: number;
  mandatoryGroupHours: number;
  formation: any;
  formationType: any;
  formationLabel: string;
  nbr: number;
  nbrReport: number;
  numOfHours: number;
  numOfGroupHours: number;
  isHeFormator: boolean;
  isitAPublication: boolean;
  nbrAdjustHour: number;
  motifAdjustHour: string;
  reportableHours: number;
  serment: string,
  casePalais : string,
  adresse: string,
  telephone: string,
  imageUrl: string,
case: string,
tel: string,
ville: string,
site: string,
domaine1: string,
domaine2: string,
domaine3: string,
langue1: string,
langue2: string,
langue3: string,
cabinetSecondaire: string,
specialite: string,
mediateur: string,
titre: string,
cabinet: any,
cp: number,
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {


  //@Input() lawyersList: Lawyers[];
  lawyers$
  formation$
  generalData$

  displayedColumns: string[] = ['nom', 'prenom', 'email', 'group', 'formationDay', 'formationDayGroup', 'formationDayDo', 'formationDayGroupDo', 'formationHoursReport', 'formationHoursReportable', 'formationList', 'update', 'trash'];
  dataSource
  db

  updateUserDataTmp: DialogData;
  sortedData;
  sortedGeneralData;
  dataSortedByUser: Sort;
  SatisfyListMode = false;
  SatisfyNumber: number;
  UnsatisfyListMode = false;
  UnsatisfyNumber: number;
  sortedDataTmp
  selectedDate = ((new Date()).getFullYear()).toString();
  numberOfLawyer: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer, public formationService: FormationService, private contentService: ContentService) {



    const dbGeneral = getDatabase();
    const starCountRefGeneral = ref(dbGeneral, 'general/');
    onValue(starCountRefGeneral, (snapshot) => {
      const data = snapshot.val();
      this.generalData$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      this.dataSource = new MatTableDataSource(this.generalData$);
      this.sortedGeneralData = this.generalData$.slice()
      this.bddCommunicationService.batonnier = this.sortedGeneralData[0].value.prenom + ' ' + this.sortedGeneralData[0].value.nom;
      if(data)
      {
        this.bddCommunicationService.selectedDate = this.sortedGeneralData[1].value
        this.selectedDate = this.bddCommunicationService.selectedDate

        const db = getDatabase();
        const starCountRef = ref(db, this.bddCommunicationService.selectedDate +'/avocats/');
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
          this.dataSource = new MatTableDataSource(this.lawyers$);
          this.numberOfLawyer = this.lawyers$.length

          this.sortedData = this.lawyers$.slice()
          this.sortedData.sort(this.SortSatisfyArray)
          if(this.dataSortedByUser)
          {
            this.sortData(this.dataSortedByUser)
          }
        })


        const dbFormation = getDatabase();
        const starCountRefFormation = ref(dbFormation, this.bddCommunicationService.selectedDate +'/formation/');
        onValue(starCountRefFormation, (snapshot) => {
        const data = snapshot.val();
        if(data)
        {
          this.formation$ = Object.keys(data).map((key) => ({
            type: key,
            value: data[key],
          }));
        }
      });
      }
    })


  }

  updateDisplayYear()
  {
    this.bddCommunicationService.updateDisplayYear(this.selectedDate);
  }

  refreshHours(){
    for(const lawyer of this.lawyers$)
    {
      for(const formation of this.formation$)
      {
        if(formation.type === lawyer.type)
        {
          let formationList = []
          formationList = Object.keys(formation.value).map((key) => ({
            type: key,
            value: formation.value[key],
          }));

          this.bddCommunicationService.sendNewHours(
            lawyer.type,
            formationList
          );
          this.bddCommunicationService.sendNewGroupHours(
            lawyer.type,
            formationList
          );
        }
      }
    }
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


  updateUser(){
    const db = getDatabase();
    update(ref(db, "avocats/" + this.updateUserDataTmp.id), {
      prenom: this.updateUserDataTmp.prenom,
      nom: this.updateUserDataTmp.nom,
      email: this.updateUserDataTmp.email,
      group: this.updateUserDataTmp.group,
      mandatoryHoursGroup: this.updateUserDataTmp.mandatoryGroupHours
    })
  }


  removeUser(userKey){
    const db = getDatabase();
    remove(ref(db, this.bddCommunicationService.selectedDate + "/avocats/" + userKey));
    remove(ref(db, this.bddCommunicationService.selectedDate + "/formation/" + userKey))

    if(this.dataSortedByUser)
    {
      this.sortData(this.dataSortedByUser)
    }
  }


  isMyTable(element)
  {
    // console.log(element)
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddLawyerComponent, {
      height: "70vh",
      width: "40vw",
      data: {nom: "", prenom: "", email: "", group: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }

  openExcelDialog(): void {
    const dialogRef = this.dialog.open(DialogExcelComponent, {
      height: "80vh",
      width: "60vw",
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }

  openUpdateDialog(id, nom, prenom, email, group): void {
    const dialogRef = this.dialog.open(DialogUpdateLawyerComponent, {
      height: "70vh",
      width: "40vw",
      data: {id: id, nom: nom, prenom: prenom, email: email, group: group},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }

  openInformationDialog(id, nom, prenom, email, group, formation, formationType, formationLabel, mandatoryHours, nbr, nbrReport, nbrAdjustHour,
    motifAdjustHour, reportableHours): void {
      console.log(id)
    const dialogRef = this.dialog.open(DialogInformationLawyerComponent, {
      height: "80vh",
      width: "80vw",
      data: {id: id, nom: nom, prenom: prenom, email: email, group: group, formation: formation, formationType:formationType, formationLabel: formationLabel, mandatoryHours: mandatoryHours, nbr: nbr, nbrReport: nbrReport, nbrAdjustHour: nbrAdjustHour, motifAdjustHour: motifAdjustHour, reportableHours: reportableHours},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(result);
    });
  }


  isMandatoryFormation(element)
  {

    if(this.formationService.isGroupParticularity(element.value.group) <= element.value.nbr)
    {
      return true
    }
    else
    {
      return false
    }
  }

  generateSatisfyList()
  {
    this.SatisfyListMode = !this.SatisfyListMode

    if(this.SatisfyListMode)
    {
      const satisfyList = []
      const unsatisfyList = []
      this.bddCommunicationService.getSatisfyList(this.lawyers$, satisfyList, unsatisfyList)
      satisfyList.sort(this.SortSatisfyArray)
      this.SatisfyNumber = satisfyList.length
      this.generateSatisfyPdf(satisfyList)
      this.sortedDataTmp = this.sortedData
      this.sortedData = new MatTableDataSource(satisfyList);

    }
    else
    {
      this.sortedData = this.sortedDataTmp;
    }

  }

  generateUnsatisfyList()
  {
    this.UnsatisfyListMode = !this.UnsatisfyListMode

    if(this.UnsatisfyListMode)
    {
      const satisfyList = []
      const unsatisfyList = []
      
      this.bddCommunicationService.getSatisfyList(this.lawyers$, satisfyList, unsatisfyList)
      unsatisfyList.sort(this.SortSatisfyArray)
      this.UnsatisfyNumber = unsatisfyList.length

      this.generateUnsatisfyPdf(unsatisfyList)
      this.sortedDataTmp = this.sortedData
      this.sortedData = new MatTableDataSource(unsatisfyList);

    }
    else
    {
      this.sortedData = this.sortedDataTmp;
    }

  }

  SortSatisfyArray(x, y) {
    if (x.value.nom  < y.value.nom) {
      return -1;
    }
    if (x.value.nom > y.value.nom) {
      return 1;
    }
    return 0;
  }


   /** Announce the change in sort state for assistive technology. */
   announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {

      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {

      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  generateSatisfyPdf(datas) {
    const document = this.getGlobalDocument(
      datas
    );
    pdfMake.createPdf(document).download();
  }

  getGlobalDocument(datas) {
    const tables = [];
    const logo = this.contentService.logoBase64;

    tables.push({
      image: logo,
      width: 60,
    },
    {
      text: 'Avocats ayant satisfaits à leurs obligations de formation : ' +  this.SatisfyNumber,
      bold: true,
      fontSize: 20,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
    {
      text: 'Formations satisfaite',
      margin: [0, 10, 0, 10],
      style: 't1',
    },)


      tables.push(
        {
          table: {
            widths: ['*', '*'],
            heights: 40,
            body: [
              ['Nom', 'Prénom'],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
      );

      for (const data of datas) {
        tables[3].table.body.push(
          [data.value.nom, data.value.prenom],
        )
      }

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


    generateUnsatisfyPdf(datas) {

      console.log('les datas de generateUnsatisfyPdf :', datas)
      const document = this.getGlobalUnsatisfyDocument(
        datas
      );
      pdfMake.createPdf(document).download();
    }

    getGlobalUnsatisfyDocument(datas) {
      const tables = [];
      const logo = this.contentService.logoBase64;

      console.log('les datas de getGlobalUnsatisfyDocument :', datas)


      tables.push({
        image: logo,
        width: 60,
      },
      {
        text: 'Avocats n\'ayant pas satisfaits à leurs obligations de formation : ' + this.UnsatisfyNumber || 0,
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      {
        text: 'Formations non satisfaite',
        margin: [0, 10, 0, 10],
        style: 't1',
      },)


        tables.push(
          {
            table: {
              widths: ['*', '*'],
              heights: 40,
              body: [
                ['Nom', 'Prénom'],
              ],
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex === 0 ? '#CCCCCC' : null;
              },
            },
          },
        );

        for (const data of datas) {
          tables[3].table.body.push(
            [data.value.nom || '', data.value.prenom || ''],
          )
        }

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




