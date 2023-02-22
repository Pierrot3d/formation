import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelComponent } from './excel/excel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { DialogExcelComponent } from './dialogExcel/dialogExcel.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';





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
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule,
    MatSelectModule,
  ],
  exports:
    [
      ExcelComponent,
      ImportExcelComponent,
      DialogExcelComponent
    ]
})
export class ExcelModule { }
