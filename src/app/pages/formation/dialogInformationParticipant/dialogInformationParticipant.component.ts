import { Component, Inject, ViewChild } from '@angular/core';
import { getDatabase, ref, onValue } from '@angular/fire/database';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { FormationService } from 'src/app/services/formation.service';
import { DialogOrdreFormationData } from '../formation/formation.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-dialogInformationParticipant',
  templateUrl: './dialogInformationParticipant.component.html',
  styleUrls: ['./dialogInformationParticipant.component.css']
})
export class DialogInformationParticipantComponent {

  OrdreFormation$

  displayedColumns: string[] = ['participant', 'trash' ];
  dataSource
  db

  sortedData;
  dataTable: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor( public dialogRef: MatDialogRef<DialogInformationParticipantComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogOrdreFormationData){
      console.log(this.data)

      for(const elmnt of this.data.participant)
      {
        this.dataTable.push(elmnt)
      }
    }

  }


