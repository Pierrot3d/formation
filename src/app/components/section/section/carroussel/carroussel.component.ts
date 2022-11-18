import { Component, Input, OnInit } from '@angular/core';
import { Paragraphe } from 'src/app/models/menu.model';

@Component({
  selector: 'app-carroussel',
  templateUrl: './carroussel.component.html',
  styleUrls: ['./carroussel.component.scss']
})
export class CarrousselComponent implements OnInit {

  @Input() content: Paragraphe[];

  constructor() { }

  ngOnInit(): void {
    console.log(this.content)
  }

}
