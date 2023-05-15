import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';
import { DialogData } from '../../table/table/table.component';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent  {

  constructor(
    private bddCommunicationService: BddCommunicationService)
  { }

    selectedGroup = "";

  generateExcel() {
    console.log(this.selectedGroup)
    this.bddCommunicationService.generateExcel(this.selectedGroup);
  }

}
