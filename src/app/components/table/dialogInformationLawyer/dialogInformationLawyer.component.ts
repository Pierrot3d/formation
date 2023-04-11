/* eslint-disable @angular-eslint/component-selector */
import { BddCommunicationService } from './../../../services/bdd-communication.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../table/table.component';
import {FormGroup, FormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import { getDatabase, ref, onValue, remove, update} from "firebase/database";


@Component({
  selector: 'app-dialogInformationLawyer',
  templateUrl: './dialogInformationLawyer.component.html',
  styleUrls: ['./dialogInformationLawyer.component.css']
})
export class DialogInformationLawyerComponent  {


  displayedColumns: string[] = ['formation', 'date', 'nbrDay', 'nbrHours', 'total'];
  dataTmp: any;
  nbrJour: number;
  formationList$;
  sortedData;
  dataSource;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor( public dialogRef: MatDialogRef<DialogInformationLawyerComponent>,
    private bddCommunicationService: BddCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.dataTmp = [data];

      const db = getDatabase();
    const starCountRef = ref(db, 'formation/' + this.data.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if(data)
      {
        this.formationList$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
        // console.log(this.lawyers$)
        this.dataSource = new MatTableDataSource(this.formationList$);
        this.sortedData = this.formationList$.slice()
      }
      else
      {
        this.formationList$ = []
      }
    })
    }

    addFormation(start, end)
    {
      const startTMP = this.changeDateFormat(start)
      const endTMP = this.changeDateFormat(end)

      this.bddCommunicationService.updateFormation(this.data.id,this.data.formationLabel, startTMP, endTMP ,this.numOfDates, this.data.numOfHours, this.data.formation?.id)
    }

    changeDateFormat(date)
    {
      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset*60*1000))
      return date.toISOString().split('T')[0]
    }

     nbrDeJours(d1?,d2?){
      if(d1 && d2)
      {
        const WNbJours = d2.getTime() - d1.getTime();
        return Math.ceil(WNbJours/(1000*60*60*24));
      }
      else
      {
        return 0
      }
    }

    numOfDates: number;

getBusinessDatesCount(startDate, endDate) {

    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    this.numOfDates = count;
    return count;
}

sendNewJour()
{
  let nbrDayTmp: number
  nbrDayTmp = 0;

  for(let i = 0; i < this.formationList$.length; i++)
  {
    nbrDayTmp = nbrDayTmp + this.formationList$[i].value.numOfDay
  }

  this.bddCommunicationService.updateNbrDay(this.data.id, nbrDayTmp)
}

sendNewHours()
{
  let nbrHoursTmp: number
  nbrHoursTmp = 0;

  for(let i = 0; i < this.formationList$.length; i++)
  {
    console.log(nbrHoursTmp, "+", this.formationList$[i].value.numOfHours)
    nbrHoursTmp = nbrHoursTmp + +this.formationList$[i].value.numOfHours
  }
  console.log(nbrHoursTmp)
  this.bddCommunicationService.updateNbrHours(this.data.id, nbrHoursTmp)
}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
