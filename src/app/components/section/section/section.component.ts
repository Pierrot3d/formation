import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuList } from 'src/app/models/menu.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit, AfterViewInit {
  @Input() list: MenuList[];

  pratique!: ElementRef;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {}
  myFunction(item) {}
}
