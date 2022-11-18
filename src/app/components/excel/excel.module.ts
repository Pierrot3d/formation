import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelComponent } from './excel/excel.component';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ExcelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:
    [
      ExcelComponent
    ]
})
export class ExcelModule { }
