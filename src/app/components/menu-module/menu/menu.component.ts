import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGeneral } from 'src/app/models/general.model';
import { DialogGeneralComponent } from './dialog-general/dialog-general.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  constructor( public dialog: MatDialog,)
  {

  }

  openGeneralDialog(): void {
    const dialogRef = this.dialog.open(DialogGeneralComponent, {
      height: "70vh",
      width: "40vw",
      data: {nom: "", prenom: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      //console.log(result);
    });
  }

}
