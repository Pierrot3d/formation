import { Component } from '@angular/core';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent  {

  constructor(private bddCommunicationService: BddCommunicationService)
  { }


  generateExcel() {
    this.bddCommunicationService.generateExcel();
  }

}
