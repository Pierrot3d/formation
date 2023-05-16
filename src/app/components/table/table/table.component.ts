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
  numOfHours: number;
  numOfGroupHours: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {


  //@Input() lawyersList: Lawyers[];
  lawyers$

  displayedColumns: string[] = ['nom', 'prenom', 'email', 'group', 'formationDay', 'formationDayGroup', 'formationDayDo', 'formationHoursReport', 'formationHoursReportable', 'formationList', 'update', 'attestation', 'trash'];
  dataSource
  db

  updateUserDataTmp: DialogData;
  sortedData;
  dataSortedByUser: Sort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer, public formationService: FormationService) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      // console.log(this.lawyers$)
      this.dataSource = new MatTableDataSource(this.lawyers$);
      this.sortedData = this.lawyers$.slice()
      if(this.dataSortedByUser)
      {
        this.sortData(this.dataSortedByUser)
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
    remove(ref(db, "avocats/" + userKey));
    remove(ref(db, "formation/" + userKey))

    if(this.dataSortedByUser)
    {
      this.sortData(this.dataSortedByUser)
    }
  }


  isMyTable(element)
  {
    console.log(element)
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddLawyerComponent, {
      height: "70vh",
      width: "40vw",
      data: {nom: "", prenom: "", email: "", group: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);
    });
  }

  openExcelDialog(): void {
    const dialogRef = this.dialog.open(DialogExcelComponent, {
      height: "80vh",
      width: "60vw",
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);
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
      console.log(result);
    });
  }

  openInformationDialog(id, nom, prenom, email, group, formation, formationType, formationLabel): void {
    const dialogRef = this.dialog.open(DialogInformationLawyerComponent, {
      height: "80vh",
      width: "80vw",
      data: {id: id, nom: nom, prenom: prenom, email: email, group: group, formation: formation, formationType:formationType, formationLabel: formationLabel},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);
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

  generatePdf(name, surname)
  {
    const document = this.getDocument(name, surname);
    pdfMake.createPdf(document).open();
  }

  getDocument(name, surname)
  {

    const docDefinition =

    { content:[
      {
        columns: [
          [
            {
              text: 'Attestation',
              style: 'name'
            },
            {
              text: name + ' ' + surname,
            }
          ]
        ]
      },
      {
        text: 'Attestation de formation',
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      }

    ]
  }

    return docDefinition

  }
}




