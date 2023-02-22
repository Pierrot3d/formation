import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelComponent } from './excel/excel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportExcelComponent } from './import-excel/import-excel.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    ExcelComponent,
    ImportExcelComponent
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
      ImportExcelComponent
    ]
})
export class ExcelModule { }
