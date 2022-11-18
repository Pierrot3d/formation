import { Component, Input, OnInit } from '@angular/core';
import { MenuList } from 'src/app/models/menu.model';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() sticky: boolean = false;
  @Input() menuList: MenuList[] = [];

  isMenu: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onClickMenu() {
    this.isMenu = !this.isMenu;
  }

  container = 'div';
  scrollTo = '#row_8';



  scroll(el: any) {
    document.getElementById(el)!.scrollIntoView();
  }
}
