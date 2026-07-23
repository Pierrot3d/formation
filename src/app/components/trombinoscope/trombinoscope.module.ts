import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrombinoscopeComponent } from './trombinoscope.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DialogUpdateTrombinoscopeComponent } from './dialogUpdateTrombinoscope/dialogUpdateTrombinoscope.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  exports: [
    TrombinoscopeComponent,
    DialogUpdateTrombinoscopeComponent
  ],
  declarations: [TrombinoscopeComponent, DialogUpdateTrombinoscopeComponent]
})
export class TrombinoscopeModule { }
