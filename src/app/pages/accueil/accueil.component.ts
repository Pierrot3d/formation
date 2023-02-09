import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SectionComponent } from 'src/app/components/section/section/section.component';
import { MenuList } from 'src/app/models/menu.model';
import { ContentService } from 'src/app/services/content.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  providers: [DatePipe]
})
export class AccueilComponent implements OnInit {
  @ViewChild(SectionComponent) accueil: SectionComponent;
  sticky: boolean;

  laDate: Date = new Date();
  menuListTmp: MenuList[];
  menuList: MenuList[];
  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    if (window.pageYOffset > 10) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  constructor(private _contentService: ContentService, public excelService: ExcelService) {
    this._contentService.getContent().subscribe((data) => {
      this.menuListTmp = data;
    });
  }

  ngOnInit() { }
}
