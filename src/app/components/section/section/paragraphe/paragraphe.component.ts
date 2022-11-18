import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paragraphe',
  templateUrl: './paragraphe.component.html',
  styleUrls: ['./paragraphe.component.scss'],
})
export class ParagrapheComponent implements OnInit {
  @Input() paragrapheContent;
  constructor() {}

  ngOnInit(): void {}
}
