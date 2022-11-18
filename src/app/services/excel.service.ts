import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { FormExcel } from '../models/excel.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private httpClient: HttpClient,
    private datePipe: DatePipe) {
  }

  liste = [];
  isRecord: boolean;

  saveAppareilsToServer(element: FormExcel) {
    this.httpClient
      .post('https://bastiencharlotte-67daf-default-rtdb.firebaseio.com/bastienetchat.json', element)
      .subscribe(
        () => {
          console.log('Enregistrement terminé !');
          this.isRecord = true;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  getAppareilsFromServer(): [] {
    this.httpClient
      .get<any[]>('https://bastiencharlotte-67daf-default-rtdb.firebaseio.com/bastienetchat.json')
      .subscribe(
        (response) => {
          let listTmp = response;
          for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
            this.liste.push(listTmp[elemnt])
          }
          return this.liste
        },
        (error) => {
          console.log('Erreur ! : ' + error);

        }
      );

    return []
  }


  generateExcel() {

    //Excel Title, Header, Data
    const title = 'Liste des invités';
    const header = ["nom", "prenom", "email", "cocktail", "brunch", "restrictionAlimentaires"]
    const data = []
    let listTmp = this.liste;

    for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
      console.log(listTmp[elemnt])
      if ((listTmp[elemnt].cocktail === true)) {
        listTmp[elemnt].cocktail = 'participe'
      }
      else if (listTmp[elemnt].cocktail === false) {
        listTmp[elemnt].cocktail = 'ne participe pas'
      }
      else {
        if (listTmp[elemnt].cocktail) {
          listTmp[elemnt].cocktail = 'ne participe pas'
        }
      }
      if ((listTmp[elemnt].brunch === true)) {
        listTmp[elemnt].brunch = 'participe'
      }
      else if (listTmp[elemnt].brunch === false) {
        listTmp[elemnt].brunch = 'ne participe pas'
      }
      else {
        if (listTmp[elemnt].brunch) {
          listTmp[elemnt].brunch = 'ne participe pas'
        }
      }
      data.push([
        listTmp[elemnt].nom, listTmp[elemnt].prenom, listTmp[elemnt].email, listTmp[elemnt].cocktail, listTmp[elemnt].brunch, listTmp[elemnt].restrictionAlimentaires
      ])
    }



    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Données Invités');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let now = new Date()
    let newDate = this.datePipe.transform(now, 'dd/MM/yyyy hh:mm:ss')
    let subTitleRow = worksheet.addRow(['Date : ' + newDate])
    /* //Add Image
    let logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'E1:F3');
    worksheet.mergeCells('A1:D2'); */
    //Blank Row
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    for (const key of data) {
      let row = worksheet.addRow(key);
      let qty = row.getCell(5);
      let color = 'FF99FF99';
      console.log(qty.model.value)
      if (qty.model.value === 'ne participe pas') {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }
    /*  data.forEach(d => {
       let row = worksheet.addRow(d);
       let qty = row.getCell(5);
       let color = 'FF99FF99';
       if (+qty.value < 500) {
         color = 'FF9999'
       }
       qty.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: color }
       }
     }
     ); */
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.addRow([]);
    //Footer Row
    let footerRow = worksheet.addRow(['Ce fichier a été généré par un algorythme développé par Pbaron']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'listeInvites.xlsx');
    })
  }
}
