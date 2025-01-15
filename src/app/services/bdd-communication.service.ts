import { Formation } from './../models/formation.model';
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
import { onValue, remove } from '@angular/fire/database';
import { DialogAddOrdreFormationComponent } from '../pages/formation/dialogAddOrdreFormation/dialogAddOrdreFormation.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormGeneral } from '../models/general.model';

@Injectable({
  providedIn: 'root',
})
export class BddCommunicationService {
  private dbPath = 'avocats';

  constructor(
    private httpClient: HttpClient,
    private db: AngularFirestore,
    private datePipe: DatePipe
  ) {}

  getAllUsers() {
    return new Promise<any>((resolve) => {
      this.db
        .collection(this.dbPath)
        .valueChanges({ idField: 'id' })
        .subscribe((users) => resolve(users));
    });
  }

  batonnier: string;
  selectedDate: string;

  liste = [];
  listeWithId = [];

  listTMP = [];
  listWithIdTMP = [];

  formationList = [];
  formationListWithId = [];

  isRecord: boolean;

  saveGeneralToServer(element: FormGeneral) {
    this.httpClient
      .post(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/general.json',
        element
      )
      .subscribe(
        () => {
          //  console.log(element);
          this.isRecord = true;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  saveLawyersToServer(element: FormExcel) {
    this.httpClient
      .post(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/' +
          this.selectedDate +
          '/avocats.json',
        element
      )
      .subscribe(
        () => {
          this.isRecord = true;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  saveOrdreFormationToServer(element) {
    this.httpClient
      .post(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/' +
          this.selectedDate +
          '/formationOrdre.json',
        element
      )
      .subscribe(
        () => {
          this.isRecord = true;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  getLawyersFromServer(): [] {
    this.httpClient
      .get<any[]>(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/' +
          this.selectedDate +
          '/avocats.json'
      )
      .subscribe(
        (response) => {
          this.liste = [];
          this.lawyersInformationTMP = [];
          let listTmp = response;
          this.listeWithId = Object.keys(response).map((key) => ({
            type: key,
            value: response[key],
          }));
          //console.log("ceci est la listTmp", listTmp)
          for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
            this.liste.push(listTmp[elemnt]);
            this.lawyersInformationTMP.push(listTmp[elemnt]);
          }
          // console.log("ceci est la vraie liste",this.liste)
          return this.liste;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    return [];
  }

  lawyersInformationTMP;

  saveLawyersInformations(element) {
    console.log(element);
    console.log(this.listeWithId);
    for (let lawyer = 0; lawyer < this.listeWithId.length; lawyer++) {
      for (let information of element) {
        if (
          information.NOM === this.listeWithId[lawyer].value.nom &&
          information.PRENOM === this.listeWithId[lawyer].value.prenom
        ) {

          console.log(information.NOM, information.PRENOM)

          this.updateUserTMP(
            this.listeWithId[lawyer].type,
            this.listeWithId[lawyer].value.prenom,
            this.listeWithId[lawyer].value.nom,
             information.DOMAINE1,
             information.DOMAINE2,
             information.DOMAINE3,
          );
        }
      }
    }
  }

  getGeneralFromServer(): [] {
    this.httpClient
      .get<any[]>(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/general.json'
      )
      .subscribe(
        (response) => {
          this.liste = [];
          let listTmp = response;
          this.listeWithId = Object.keys(response).map((key) => ({
            type: key,
            value: response[key],
          }));
          //console.log("ceci est la listTmp", listTmp)
          for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
            this.liste.push(listTmp[elemnt]);
          }
          // console.log("ceci est la vraie liste",this.liste)
          return this.liste;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    return [];
  }

  updateUser(
    id,
    DataPrenom,
    DataNom,
    DataEmail,
    DataGroup?,
    mandatoryHoursGroup?
  ) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      prenom: DataPrenom,
      nom: DataNom,
      email: DataEmail,
      group: DataGroup,
      mandatoryHoursGroup: mandatoryHoursGroup,
    });
  }

  updateUserTMP(
    id,
    prenom,
    nom,
    domaine1,
    domaine2,
    domaine3,
  ) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      domaine1: domaine1 ? domaine1 : '',
      domaine2: domaine2 ? domaine2 : '',
      domaine3: domaine3 ? domaine3 : '',
    });
  }

  updateTrombinoscopeUser(
    id,
    imageUrl,
    nom,
    prenom,
    serment,
    casePalais,
    adresse,
    tel,
    email,
    ville,
    site,
    domaine1,
    domaine2,
    domaine3,
    langue1,
    langue2,
    langue3,
    cabinetSecondaire,
    specialite,
    mediateur,
    titre,
    cabinet,
    cp
  ) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      imageUrl: imageUrl ? imageUrl : './../../assets/img/defaut.jpg',
      nom: nom,
      email: email ? email : '',
      prenom: prenom ? prenom : '',
      case: casePalais ? casePalais : '',
      serment: serment ? serment : '',
      tel: tel ? tel : '',
      ville: ville ? ville : '',
      adresse: adresse ? adresse : '',
      site: site ? site : '',
      domaine1: domaine1 ? domaine1 : '',
      domaine2: domaine2 ? domaine2 : '',
      domaine3: domaine3 ? domaine3 : '',
      langue1: langue1 ? langue1 : '',
      langue2: langue2 ? langue2 : '',
      langue3: langue3 ? langue3 : '',
      cabinetSecondaire: cabinetSecondaire ? cabinetSecondaire : '',
      specialite: specialite ? specialite : '',
      mediateur: mediateur ? mediateur : '',
      titre: titre ? titre : '',
      cabinet: cabinet ? cabinet : '',
      cp: cp ? cp : '',
    });
  }

  updateReportableHours(id: string, reportableHours: number): Promise<void> {
    const db = getDatabase();
    
    // Retourne la promesse Firebase
    return update(ref(db, this.selectedDate + '/avocats/' + id), {
      reportableHours: reportableHours ? reportableHours : 0,
    });
  }

  updateGeneral(id, DataPrenom, DataNom) {
    const db = getDatabase();
    update(ref(db, 'general/' + id), {
      prenom: DataPrenom,
      nom: DataNom,
    });
  }

  /*  getLawyersFromServerTMP() {

    const dbFormation = getDatabase();
    const starCountRefFormation = ref(dbFormation, 'formation/');
    onValue(starCountRefFormation, (snapshot) => {
    const formationData = snapshot.val();
    if(formationData)
    {
      this.formation$ = Object.keys(formationData).map((key) => ({
        type: key,
        value: formationData[key],
      }));
    }
    console.log(this.formation$)
    this.updateNewYearLawyerTmp(this.formation$)
  });
  }

  formation$

  updateNewYearLawyerTmp(data)
  {
    const db = getDatabase();



   for(let formation of data)
    {
      if(formation.value)
      {
        let formationList = []
        formationList = Object.keys(formation.value).map((key) => ({
          type: key,
          value: formation.value[key],
        }));

        for(let formationListUniq of formationList)
        {

          const formationsend = ref(db, '2023' + '/formation/' + formation.type + '/' + formationListUniq.type);
          update(formationsend, {
            end: formationListUniq.value.end ,
            formationLabel: formationListUniq.value.formationLabel,
            formationType: formationListUniq.value.formationType ? formationListUniq.value.formationType: '',
            numOfDay: formationListUniq.value.numOfDay ? formationListUniq.value.numOfDay :0,
            numOfHours: formationListUniq.value.numOfHours ? formationListUniq.value.numOfHours : 0,
            numOfGroupHours: formationListUniq.value.numOfGroupHours ? formationListUniq.value.numOfGroupHours:0,
            start: formationListUniq.value.start,
            isHeFormator: formationListUniq.value.isHeFormator ?  formationListUniq.value.isHeFormator : false
          });
        }


      }
    }
  } */

  updateDisplayYear(displayYear) {
    const db = getDatabase();
    update(ref(db, 'general/'), {
      displayYear: displayYear,
    });
  }

  addOrdreFormation(
    range,
    data,
    lawyer,
    formationId,
    startTMP,
    endTMP,
    heuresDeGroupe?
  ) {
    this.addOrdreFormationToParticipant(
      data,
      lawyer,
      formationId,
      startTMP,
      endTMP,
      heuresDeGroupe
    );

    const value = {
      formationName: data.formationName,
      lieu: data.lieu,
      duration: data.duration,
      participant: lawyer,
      groupe: data.groupe,
      startTMP,
      endTMP,
      nbrParticipant: lawyer.length,
      individualFormationId: formationId,
    };
    this.saveOrdreFormationToServer(value);
  }

  addOrdreFormationToParticipant(
    data,
    lawyer,
    formationId,
    startTMP,
    endTMP,
    heuresDeGroupe?
  ) {
    for (const participant of lawyer) {
      formationId.push(
        this.addFormationBdd(
          participant.type,
          data.formationName,
          data.groupe ? data.groupe : '',
          startTMP,
          endTMP,
          0,
          data.duration ? data.duration : 0,
          heuresDeGroupe ? heuresDeGroupe : 0
        )
      );

      let formationList$: { type; value }[] = [];

      const db = getDatabase();
      const starCountRef = ref(
        db,
        this.selectedDate + '/formation/' + participant.type
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          formationList$ = Object.keys(data).map((key) => ({
            type: key,
            value: data[key],
          }));
          // console.log(this.lawyers$)
          // console.log(formationList$)

          // console.log(formationList$)
          this.sendNewHours(participant.type, formationList$);
        } else {
          formationList$ = [];

          return;
        }
      });
    }
  }

  updateOrdreFormationParticipant(
    idFormationOrdre,
    data,
    lawyer,
    oldFormationId,
    formationId,
    startTMP,
    endTMP
  ) {
    const db = getDatabase();

    this.addOrdreFormationToParticipant(
      data,
      lawyer,
      formationId,
      startTMP,
      endTMP
    );

    console.log('jenvoie à bdd :', lawyer);
    const formation = ref(
      db,
      this.selectedDate + '/formationOrdre/' + idFormationOrdre
    );
    update(formation, {
      formationName: data.formationName,
      duration: data.duration,
      lieu: data.lieu,
      participant: lawyer,
      groupe: data.groupe ? data.groupe : '',
      startTMP,
      endTMP,
      nbrParticipant: lawyer.length,
      individualFormationId: formationId,
    });

    return;
  }

  updateOrdreFormationInformations(
    idFormationOrdre,
    data,
    participant,
    startTMP,
    endTMP
  ) {
    const db = getDatabase();

    const formation = ref(
      db,
      this.selectedDate + '/formationOrdre/' + idFormationOrdre
    );

    update(formation, {
      formationName: data.formationName,
      duration: data.duration,
      groupe: data.groupe,
      startTMP,
      endTMP,
    });
  }

  addFormationBdd(
    id,
    formationLabel,
    formationType,
    startDay,
    endDay,
    numOfDay,
    numOfHours: number,
    numOfGroupHours: number,
    isHeFormator?: boolean,
    isitAPublication?: boolean,
    formationId?: number
  ) {
    // Create a new post reference with an auto-generated id
    const db = getDatabase();
    const lawyerListRef = ref(db, +this.selectedDate + '/formation/' + id);
    const formation = push(lawyerListRef);
    //console.log(formation.key)
    set(formation, {
      formationLabel: formationLabel,
      formationType: formationType,
      start: startDay,
      end: endDay,
      numOfDay: numOfDay,
      numOfHours: numOfHours,
      numOfGroupHours: numOfGroupHours,
      isHeFormator: isHeFormator ? isHeFormator : false,
      isitAPublication: isitAPublication ? isitAPublication : false,
    });

    return formation.key;
  }

  updateFormationBdd(
    id: string,
    formationLabel: string,
    formationType: string,
    startDay: string,
    endDay: string,
    numOfDay: number,
    numOfHours: number,
    numOfGroupHours: number,
    formationId: number,
    isHeFormator?: boolean,
    isitAPublication?: boolean
  ): Promise<void> {
    const db = getDatabase();
  
    const formationRef = ref(
      db,
      this.selectedDate + '/formation/' + id + '/' + formationId
    );
  
    // Retourne la promesse retournée par Firebase
    return update(formationRef, {
      formationLabel: formationLabel,
      formationType: formationType,
      start: startDay,
      end: endDay,
      numOfDay: numOfDay,
      numOfHours: numOfHours,
      numOfGroupHours: numOfGroupHours,
      isHeFormator: isHeFormator,
      isitAPublication: isitAPublication,
    });
  }

  updateAdjustementHour(id, nbrAdjustHour, motifAdjustHour) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      nbrAdjustHour: nbrAdjustHour,
      motifAdjustHour: motifAdjustHour,
    });
  }

  updateNbrDay(id, nbrDay) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      nbr: nbrDay,
    });
  }

  updateNbrHours(id, nbrHours) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      nbr: nbrHours,
    });
  }

  updateNbrHoursReport(id, nbrHours) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      nbrReport: nbrHours,
    });
  }

  updateNbrGroupHours(id, nbrGroupHours) {
    const db = getDatabase();
    update(ref(db, this.selectedDate + '/avocats/' + id), {
      nbrGroup: nbrGroupHours,
    });
  }

  removeUser(userKey) {
    const db = getDatabase();
    remove(ref(db, this.selectedDate + '/avocats/' + userKey));
    remove(ref(db, this.selectedDate + '/formation/' + userKey));
  }

  removeFormation(id, formationKey) {
    const db = getDatabase();
    remove(
      ref(db, this.selectedDate + '/formation/' + id + '/' + formationKey)
    );
  }

  removeOrdreFormation(userKey) {
    const db = getDatabase();
    remove(ref(db, this.selectedDate + '/formationOrdre/' + userKey));
  }

  giveMeTheList() {
    return this.liste;
  }

  giveMeTheListWithId() {
    return this.listeWithId;
  }

  getLawyersFromServerWithId(): [] {
    this.httpClient
      .get<any[]>(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/' +
          this.selectedDate +
          '/avocats.json'
      )
      .subscribe(
        (response) => {
          let listTmp = response;
          return listTmp;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    return [];
  }

  sendNewHours(id, formationList?) {
    let nbrHours = 0;
    if (formationList) {
      nbrHours = this.getFormationHours(formationList);
      this.updateNbrHours(id, nbrHours);
    } else {
      //nothing
    }
  }

  sendNewGroupHours(id, formationList?) {
    let nbrGroupHours = 0;
    if (formationList) {
      nbrGroupHours = this.getFormationGroupHours(formationList);
      this.updateNbrGroupHours(id, nbrGroupHours);
    } else {
      //nothing
    }
  }

  getSatisfyList(allLawyerInformation, satisfyList, unsatifyList) {
    for (let lawyerInformation of allLawyerInformation) {
      if (lawyerInformation.value.nbrAdjustHour) {
        lawyerInformation.value.mandatoryhoursAdjust =
          lawyerInformation.value.mandatoryHours || 20 -
          lawyerInformation.value.nbrAdjustHour || 0;
        if (
          lawyerInformation.value.nbr >=
          lawyerInformation.value.mandatoryhoursAdjust
        ) {
          satisfyList.push(lawyerInformation);
        } else {
          unsatifyList.push(lawyerInformation);
        }
      } else {
        if (
          lawyerInformation.value.nbr || 0 >= lawyerInformation.value.mandatoryHours
        ) {
          satisfyList.push(lawyerInformation);
        } else {
          unsatifyList.push(lawyerInformation);
        }
      }
    }
  }

  getFormationHours(formationList) {
    let nbrHoursTmp: number;
    nbrHoursTmp = 0;
    let formatorTable = [];

    for (let i = 0; i < formationList.length; i++) {
      if (formationList[i].value.isHeFormator) {
        let nbrFormatorHours = formationList[i].value.numOfHours * 4;

        nbrHoursTmp = nbrHoursTmp + +nbrFormatorHours;
      } else {
        nbrHoursTmp = nbrHoursTmp + +formationList[i].value.numOfHours;
      }
    }

    return nbrHoursTmp;
  }

  getFormationGroupHours(formationList) {
    let nbrGroupHoursTmp: number;
    nbrGroupHoursTmp = 0;

    for (let i = 0; i < formationList.length; i++) {
      nbrGroupHoursTmp =
        nbrGroupHoursTmp + +formationList[i].value.numOfGroupHours;
    }

    return nbrGroupHoursTmp;
  }

  generateExcel(group?) {
    //Excel Title, Header, Data
    const title = 'Liste des Avocats';
    const header = [
      'Nom',
      'Prénom',
      'E-mail',
      'Groupe',
      "Nombre d'heures obligatoires",
      'nbr heures Groupe',
      'Heures effectuées',
      'Heures reportées',
      'formationList',
    ];
    const data = [];

    this.httpClient
      .get<any[]>(
        'https://barreaudetours-f3e06-default-rtdb.europe-west1.firebasedatabase.app/avocats.json'
      )
      .subscribe(
        (response) => {
          this.liste = [];
          let listTmp = response;
          this.listeWithId = Object.keys(response).map((key) => ({
            type: key,
            value: response[key],
          }));
          //console.log("ceci est la listTmp", listTmp)
          for (let elemnt of Object.getOwnPropertyNames(listTmp)) {
            this.liste.push(listTmp[elemnt]);
          }

          listTmp = this.liste;

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
            //console.log(group)
            if (group) {
              if (group === listTmp[elemnt].group) {
                data.push([
                  listTmp[elemnt].nom,
                  listTmp[elemnt].prenom,
                  listTmp[elemnt].email,
                  listTmp[elemnt].group,
                  listTmp[elemnt].mandatoryHours,
                  listTmp[elemnt].mandatoryHoursGroup,
                  listTmp[elemnt].nbr,
                  listTmp[elemnt].nbrReport,
                  listTmp[elemnt].formationList,
                ]);
              } else {
                continue;
              }
            } else {
              data.push([
                listTmp[elemnt].nom,
                listTmp[elemnt].prenom,
                listTmp[elemnt].email,
                listTmp[elemnt].group,
                listTmp[elemnt].mandatoryHours,
                listTmp[elemnt].mandatoryHoursGroup,
                listTmp[elemnt].nbr,
                listTmp[elemnt].nbrReport,
                listTmp[elemnt].formationList,
              ]);
            }
          }

          //Create workbook and worksheet
          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet('Données Formation');
          //Add Row and formatting
          let titleRow = worksheet.addRow([title]);
          titleRow.font = {
            name: 'Futura',
            family: 4,
            size: 16,
            underline: 'double',
            bold: true,
          };
          worksheet.addRow([]);
          let now = new Date();
          let newDate = this.datePipe.transform(now, 'dd/MM/yyyy hh:mm:ss');
          let subTitleRow = worksheet.addRow(['Date : ' + newDate]);
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
              bgColor: { argb: 'FF0000FF' },
            };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
          // worksheet.addRows(data);
          // Add Data and Conditional Formatting
          for (const key of data) {
            let row = worksheet.addRow(key);
            let qty = row.getCell(7);
            let color = 'FF99FF99';
            if (
              qty.model.value < row.getCell(5).model.value ||
              qty.model.value === undefined
            ) {
              color = 'FF9999';
            }
            qty.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            };
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
          let footerRow = worksheet.addRow([
            'Ce fichier a été généré par un algorythme développé par Pbaron',
          ]);
          footerRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCFFE5' },
          };
          footerRow.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          //Merge Cells
          worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
          //Generate Excel File with given name
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, 'listeFormation.xlsx');
          });

          return this.liste;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    return [];
  }
}
