/* eslint-disable no-irregular-whitespace */
/* eslint-disable prefer-const */
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lawyers } from 'src/app/models/lawyers.model';
import { getDatabase, ref, update, push, set, get, child} from "firebase/database";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormExcel } from '../models/excel.model';

@Injectable({
  providedIn: 'root'
})
export class BddCommunicationService {

  private dbPath = 'avocats';

constructor(private httpClient: HttpClient,
  private db: AngularFirestore) { }

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
        //console.log("ceci est la vraie liste",this.liste)
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

updateUser(id, DataPrenom, DataNom, DataEmail, DataGroup?){
  const db = getDatabase();
  update(ref(db, "avocats/" + id), {
    prenom: DataPrenom,
    nom: DataNom,
    email: DataEmail,
    group: DataGroup
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

}
