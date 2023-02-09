import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Input, Inject, DebugElement } from '@angular/core';
import { getDatabase, ref, onValue, remove} from "firebase/database";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  //@Input() lawyersList: Lawyers[];
  lawyers$

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'update', 'star'];
  dataSource
  db

  constructor(public excelService: ExcelService) {
    const db = getDatabase();
    const starCountRef = ref(db, 'avocats/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      this.lawyers$ = Object.keys(data).map(key => ({type: key, value: data[key]}))
      console.log(this.lawyers$)
    })
  }

  ngOnInit(): void {

  }

  updateUser(userKey){
    const db = getDatabase();
    remove(ref(db, "avocats/" + userKey))
  }


  removeUser(userKey){
    const db = getDatabase();
    remove(ref(db, "avocats/" + userKey))
  }


  isMyTable(element)
  {
    console.log(element)
  }

}

