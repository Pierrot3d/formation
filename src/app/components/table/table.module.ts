import { DialogUpdateLawyerComponent } from './dialogUpdateLawyer/dialogUpdateLawyer.component';
import { TableComponent } from './table/table.component';
import { NgModule } from '@angular/core';
import { SpinBoxComponent } from '../spin-box/spin-box.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DialogAddLawyerComponent } from './dialogAddLawyer/dialogAddLawyer.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';







@NgModule({
  declarations: [TableComponent, DialogAddLawyerComponent, DialogUpdateLawyerComponent, SpinBoxComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule,
    FormsModule,
    MatSelectModule,
    RouterModule
  ],
  exports: [
    TableComponent,
    DialogAddLawyerComponent,
    DialogUpdateLawyerComponent
  ],
  bootstrap: [TableComponent],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})

export class TableModule { }
