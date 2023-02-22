import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelComponent } from './excel/excel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { DialogExcelComponent } from './dialogExcel/dialogExcel.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ExcelComponent,
    ImportExcelComponent,
    DialogExcelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  exports:
    [
      ExcelComponent,
      ImportExcelComponent,
      DialogExcelComponent
    ]
})
export class ExcelModule { }
