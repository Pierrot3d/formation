import { NgModule } from '@angular/core';
import { SpinBoxComponent } from './spin-box.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    SpinBoxComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatTableModule
  ],
  exports: [
    SpinBoxComponent
  ]
})
export class SpinBoxModule { }
