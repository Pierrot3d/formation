import { Component, OnInit, Input } from '@angular/core';
import { Lawyers } from 'src/app/models/lawyers.model';
import { Observable } from 'rxjs';
import { getDatabase, ref, onValue} from "firebase/database";


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

  constructor() {
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

  isMyTable()
  {
  }

}
