import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogGeneralComponent } from './menu/dialog-general/dialog-general.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
    DialogGeneralComponent
  ],
  imports: [
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    FormsModule
  ],
  exports: [
    DialogGeneralComponent,
    MenuComponent,
  ]
})
export class MenuModuleModule { }
