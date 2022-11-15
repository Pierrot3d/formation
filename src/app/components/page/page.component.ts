import { Component, OnInit } from '@angular/core';
import { PageList } from 'src/app/models/page.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  pageList!: PageList;

  constructor() { }

  ngOnInit() {
  }

}
