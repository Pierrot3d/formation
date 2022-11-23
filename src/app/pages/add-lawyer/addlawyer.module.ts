import { AddLawyerComponent } from './add-lawyer/add-lawyer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    AddLawyerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:
    [
      AddLawyerComponent
    ]
})
export class AddLawyerModule { }
