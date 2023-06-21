import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGeneral } from 'src/app/models/general.model';
import { DialogGeneralComponent } from './dialog-general/dialog-general.component';
import { getDatabase, onValue, ref } from '@angular/fire/database';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  generalData$
  dataSource
  sortedData

  constructor( public dialog: MatDialog, private bddCommunicationService: BddCommunicationService)
  {
    const db = getDatabase();
    const starCountRef = ref(db, 'general/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.generalData$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      this.dataSource = new MatTableDataSource(this.generalData$);
      this.sortedData = this.generalData$.slice()
      console.log(this.sortedData)
      this.bddCommunicationService.batonnier = this.sortedData[0].value.prenom + ' ' + this.sortedData[0].value.nom;
    })
  }

  openGeneralDialog(): void {
    const dialogRef = this.dialog.open(DialogGeneralComponent, {
      height: "70vh",
      width: "40vw",
      data: {id: this.sortedData[0].type, nom: this.sortedData[0].value.nom, prenom: this.sortedData[0].value.prenom},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }

}
