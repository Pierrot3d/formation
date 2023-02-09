import { TableComponent } from './table/table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,

  ],
  exports: [
    TableComponent
  ],
})

export class TableModule { }
