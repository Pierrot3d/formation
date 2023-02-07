import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paragraphe',
  templateUrl: './paragraphe.component.html',
  styleUrls: ['./paragraphe.component.scss'],
})
export class ParagrapheComponent implements OnInit {
  @Input() paragrapheContent;
  constructor(private route: Router) {}

  ngOnInit(): void {}
}
