import { ExcelService } from 'src/app/services/excel.service';
import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";
import {MatDialog } from '@angular/material/dialog';
import { DialogAddLawyerComponent } from '../dialogAddLawyer/dialogAddLawyer.component';
import { DialogUpdateLawyerComponent } from '../dialogUpdateLawyer/dialogUpdateLawyer.component';

export interface DialogData {
  email: string;
  nom: string;
  prenom: string;
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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'update', 'star'];
  dataSource
  db

  updateUserDataTmp: DialogData;

  constructor(public excelService: ExcelService, public dialog: MatDialog) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      console.log(this.lawyers$)
    })
  }

  updateUser(){
    const db = getDatabase();
    update(ref(db, "avocats/" + this.updateUserDataTmp.id), {
      prenom: this.updateUserDataTmp.prenom,
      nom: this.updateUserDataTmp.nom,
      email: this.updateUserDataTmp.email,
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

  openAddDialog(id, nom, prenom, email): void {
    const dialogRef = this.dialog.open(DialogAddLawyerComponent, {
      height: "40vh",
      width: "50vw",
      data: {id: id, nom: nom, prenom: prenom, email: email},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  openUpdateDialog(id, nom, prenom, email): void {
    const dialogRef = this.dialog.open(DialogUpdateLawyerComponent, {
      height: "40vh",
      width: "50vw",
      data: {id: id, nom: nom, prenom: prenom, email: email},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}



