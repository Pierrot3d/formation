import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { BddCommunicationService } from 'src/app/services/bdd-communication.service';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent   {
  spinnerEnabled = false;
  keys: string[];
  dataSheet: any = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  dataImported: any;

  constructor(
    private bddCommunicationService: BddCommunicationService ) {}

  onChange(evt) {
    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        console.log(XLSX.utils.sheet_to_json(ws))
        data = XLSX.utils.sheet_to_json(ws);
        this.dataImported = data;
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  importData()
  {

    // eslint-disable-next-line prefer-const
    for(let elmt of this.dataImported)
    {
      const str = elmt.nom
      const words = str.split(' ');
      this.addUser(words[1], words[0])
      console.log(words[1], words[0] )
    }
    console.log(this.dataImported)
  }


  addUser(prenom, nom)
  {
    const value = {
      prenom: prenom,
      nom: nom,
      email: "non renseigné",
      mandatoryHours: 20,
    }
    this.bddCommunicationService.saveLawyersToServer(value);
    this.bddCommunicationService.getLawyersFromServer();
  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
  }



}
