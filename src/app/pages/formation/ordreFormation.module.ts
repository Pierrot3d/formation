import { DialogAddOrdreFormationComponent } from './dialogAddOrdreFormation/dialogAddOrdreFormation.component';
import { FormationComponent } from './formation/formation.component';
import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogInformationParticipantComponent } from './dialogInformationParticipant/dialogInformationParticipant.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';




@NgModule({
  declarations: [FormationComponent, DialogAddOrdreFormationComponent, DialogInformationParticipantComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    ReactiveFormsModule,
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
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  exports: [
    FormationComponent,
    DialogAddOrdreFormationComponent,
    DialogInformationParticipantComponent
  ],
  bootstrap: [FormationComponent],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

  ]
})

export class ordreFormationModule { }
