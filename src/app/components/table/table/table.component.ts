import { Component, OnInit, Input } from '@angular/core';
import { Lawyers } from 'src/app/models/lawyers.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() lawyersList: Lawyers[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'star'];
  dataSource

  constructor() {
  }

  ngOnInit(): void {
  }

  isMyTable()
  {
  }

}
