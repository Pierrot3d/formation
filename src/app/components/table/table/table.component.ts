import { BddCommunicationService } from "src/app/services/bdd-communication.service";
import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";
import {MatDialog } from '@angular/material/dialog';
import { DialogAddLawyerComponent } from '../dialogAddLawyer/dialogAddLawyer.component';
import { DialogUpdateLawyerComponent } from '../dialogUpdateLawyer/dialogUpdateLawyer.component';
import {MatTableDataSource} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Sort} from '@angular/material/sort';


export interface DialogData {
  email: string;
  nom: string;
  prenom: string;
  group: string;
  id: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  //@Input() lawyersList: Lawyers[];
  lawyers$

  displayedColumns: string[] = ['nom', 'prenom', 'email', 'group', 'update', 'trash'];
  dataSource
  db

  updateUserDataTmp: DialogData;
  sortedData;


  constructor(public bddCommunicationService: BddCommunicationService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      // console.log(this.lawyers$)
      this.dataSource = new MatTableDataSource(this.lawyers$);
      this.sortedData = this.lawyers$.slice()
    })
  }

  updateUser(){
    const db = getDatabase();
    update(ref(db, "avocats/" + this.updateUserDataTmp.id), {
      prenom: this.updateUserDataTmp.prenom,
      nom: this.updateUserDataTmp.nom,
      email: this.updateUserDataTmp.email,
      group: this.updateUserDataTmp.group
    })
  }


  removeUser(userKey){
    const db = getDatabase();
    remove(ref(db, "avocats/" + userKey))
  }


  isMyTable(element)
  {
    console.log(element)
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddLawyerComponent, {
      height: "60vh",
      width: "50vw",
      data: {nom: "", prenom: "", email: "", group: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);
    });
  }

  openUpdateDialog(id, nom, prenom, email, group): void {
    const dialogRef = this.dialog.open(DialogUpdateLawyerComponent, {
      height: "60vh",
      width: "50vw",
      data: {id: id, nom: nom, prenom: prenom, email: email, group: group},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      console.log(result);
    });
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
}




