import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';



@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent,
  ]
})
export class MenuModuleModule { }
