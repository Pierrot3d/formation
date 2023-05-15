/* eslint-disable no-irregular-whitespace */
/* eslint-disable prefer-const */
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lawyers } from 'src/app/models/lawyers.model';
import { getDatabase, ref, update, push, set, get, child} from "firebase/database";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormExcel } from '../models/excel.model';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BddCommunicationService {

  private dbPath = 'avocats';

constructor(private httpClient: HttpClient,
  private db: AngularFirestore,
  private datePipe: DatePipe) { }

getAllUsers() {
      return new Promise<any>((resolve)=> {
        this.db.collection(this.dbPath).valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
      })
  }

liste = [];
listeWithId = [];

formationList = [];
formationListWithId = [];

isRecord: boolean;

saveLawyersToServer(element: FormExcel) {
  this.httpClient
    .post('https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/avocats.json', element)
    .subscribe(
      () => {
      //  console.log(element);
        console.log('Enregistrement terminé !');
        this.isRecord = true;
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
}

getLawyersFromServer(): [] {
  this.httpClient
    .get<any[]>('https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/avocats.json')
    .subscribe(
      (response) => {
        this.liste = [];
        let listTmp = response;
        this.listeWithId = Object.keys(response).map(key => ({type: key, value: response[key]}));
        //console.log("ceci est la listTmp", listTmp)
        for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
          this.liste.push(listTmp[elemnt])
        }
        console.log("ceci est la vraie liste",this.liste)
        return this.liste
      },
      (error) => {
        console.log('Erreur ! : ' + error);

      }
    );
  return []
}

getFormationFromServer(id): [] {
  const db = getDatabase();
  const dbRef = ref(db, 'formation/');
   get(child(dbRef, id)).then((snapshot) => {
    if (snapshot.exists()) {

      console.log(snapshot.val());
      this.formationList = [];
        let listTmp = snapshot.val();
        this.formationListWithId = Object.keys(snapshot.val()).map(key => ({type: key, value: snapshot.val()[key]}));
        //console.log("ceci est la listTmp", listTmp)
        for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
          this.formationList.push(listTmp[elemnt])
        }
        //console.log("ceci est la vraie liste",this.liste)
        return this.formationList
    } else {
      console.log("No data available");
      return []
    }
  }).catch((error) => {
    console.error(error);
  });
  return []
}

updateUser(id, DataPrenom, DataNom, DataEmail, DataGroup?, mandatoryHoursGroup?){
  const db = getDatabase();
  update(ref(db, "avocats/" + id), {
    prenom: DataPrenom,
    nom: DataNom,
    email: DataEmail,
    group: DataGroup,
    mandatoryHoursGroup: mandatoryHoursGroup
  })
}



updateFormation(id, formationLabel, formationType, startDay, endDay, numOfDay, numOfHours: number, numOfGroupHours:number, formationId? : number){
  // Create a new post reference with an auto-generated id
const db = getDatabase();
const lawyerListRef = ref(db, 'formation/' + id);
const formation = push(lawyerListRef);
console.log(startDay, endDay)
set(formation, {
  formationLabel: formationLabel,
  start: startDay,
  end: endDay,
  numOfDay: numOfDay,
  numOfHours: numOfHours,
  numOfGroupHours: numOfGroupHours
});

}

updateNbrDay(id, nbrDay)
{
  const db = getDatabase();
  update(ref(db, "avocats/" + id), {
    nbr: nbrDay
  })
}

updateNbrHours(id, nbrHours)
{
  const db = getDatabase();
  update(ref(db, "avocats/" + id), {
    nbr: nbrHours
  })
}

updateNbrHoursReport(id, nbrHours)
{
  const db = getDatabase();
  update(ref(db, "avocats/" + id), {
    nbrReport: nbrHours
  })
}

giveMeTheList()
{
  return this.liste
}

giveMeTheListWithId()
{
  return this.listeWithId
}

getLawyersFromServerWithId(): [] {
  this.httpClient
    .get<any[]>('https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/avocats.json')
    .subscribe(
      (response) => {
        let listTmp = response;
        console.log(listTmp)
        return listTmp
      },
      (error) => {
        console.log('Erreur ! : ' + error);

      }
    );
  return []
}


generateExcel() {

  //Excel Title, Header, Data
  const title = 'Liste des Avocats';
  const header = ['Nom', 'Prénom', 'E-mail', 'Groupe', 'Nombre d\'heures obligatoires', 'nbr heures Groupe', 'Heures effectuées', 'Heures reportées', 'formationList']
  const data = []

  this.httpClient
  .get<any[]>('https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/avocats.json')
  .subscribe(
    (response) => {
      this.liste = [];
      let listTmp = response;
      this.listeWithId = Object.keys(response).map(key => ({type: key, value: response[key]}));
      //console.log("ceci est la listTmp", listTmp)
      for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
        this.liste.push(listTmp[elemnt])
      }

      listTmp = this.liste;
      console.log(listTmp)

      for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
        // console.log(listTmp[elemnt])
        /* if ((listTmp[elemnt].cocktail === true)) {
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
        } */
        data.push([
          listTmp[elemnt].nom, listTmp[elemnt].prenom, listTmp[elemnt].email, listTmp[elemnt].group, listTmp[elemnt].mandatoryHours, listTmp[elemnt].mandatoryHoursGroup, listTmp[elemnt].nbr, listTmp[elemnt].formationHoursReport, listTmp[elemnt].formationList
        ])
      }



      //Create workbook and worksheet
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Données Formation');
      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'Futura', family: 4, size: 16, underline: 'double', bold: true }
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
        let qty = row.getCell(7);
        let color = 'FF99FF99';
        console.log(qty.model.value)
        if (qty.model.value < row.getCell(5).model.value || qty.model.value === undefined) {
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
       worksheet.getColumn(1).width = 30;
       worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 10;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 10;
      worksheet.getColumn(6).width = 10;
      worksheet.getColumn(7).width = 10;
      worksheet.getColumn(8).width = 10;
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
        fs.saveAs(blob, 'listeFormation.xlsx');
      })

      return this.liste
    },
    (error) => {
      console.log('Erreur ! : ' + error);

    }
  );
return []


}

}
