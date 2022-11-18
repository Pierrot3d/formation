import { Component,
  OnInit,
  HostListener,
  ViewChild, } from '@angular/core';
import { MenuList } from 'src/app/models/menu.model';
import { ContentService } from 'src/app/services/content.service';

@Component({
  templateUrl: './app-pages.component.html',
  styleUrls: ['./app-pages.component.scss']
})
export class AppPagesComponent implements OnInit {

  sticky: boolean = false;
  menuListTmp: MenuList[]= [];
  menuList: MenuList[] = [];

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    if (window.pageYOffset > 10) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  constructor(private _contentService: ContentService) {
    this._contentService.getContent().subscribe((data) => {
      this.menuListTmp = data;
    });
  }

  ngOnInit(): void {
  }

}
