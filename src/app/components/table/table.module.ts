import { TableComponent } from './table/table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'




@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    TableComponent
  ],
})

export class TableModule { }
