import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrombinoscopeComponent } from './trombinoscope.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule
  ],
  exports: [
    TrombinoscopeComponent,

  ],
  declarations: [TrombinoscopeComponent]
})
export class TrombinoscopeModule { }
