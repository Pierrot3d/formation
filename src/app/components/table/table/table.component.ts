import { ExcelService } from 'src/app/services/excel.service';
import { Component } from '@angular/core';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";
import {MatDialog } from '@angular/material/dialog';
import { DialogAddLawyerComponent } from '../dialogAddLawyer/dialogAddLawyer.component';

export interface DialogData {
  mail: string;
  name: string;
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

  mail: string;
  name: string;

  constructor(public excelService: ExcelService, public dialog: MatDialog) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      console.log(this.lawyers$)
    })
  }

  updateUser(userKey){
    const db = getDatabase();
    update(ref(db, "avocats/" + userKey), {
      prenom: "Pierre",
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddLawyerComponent, {
      data: {name: this.name, mail: this.mail},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.mail = result;
    });
  }
}



