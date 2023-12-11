import { AddLawyerModule } from './pages/add-lawyer/addlawyer.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppPagesComponent } from './components/app-pages/app-pages.component';
import { AddUsersComponent } from './components/app-pages/add-users/add-users.component';
import { MenuModuleModule } from './components/menu-module/menu-module.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ExcelModule } from './components/excel/excel.module';
import { ImageModule } from './components/image/image.module';
import { SectionModule } from './components/section/section.module';
import { DatePipe, registerLocaleData } from '@angular/common';
import { TimerComponent } from './components/timer/timer.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { DownloadComponent } from './pages/download/download.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';
import localeFr from '@angular/common/locales/fr';
import { TableModule } from './components/table/table.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ordreFormationModule } from './pages/formation/ordreFormation.module';
import { SpinBoxModule } from './components/spin-box/spin-box.module';


registerLocaleData(localeFr, 'fr');


@NgModule({
  declarations: [
    AppComponent,
    AppPagesComponent,
    AddUsersComponent,
    TimerComponent,
    AccueilComponent,
    RsvpComponent,
    DownloadComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserModule,
    AngularFireModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    MenuModuleModule,
    RouterModule,
    SectionModule,
    HttpClientModule,
    ImageModule,
    RouterModule,
    ExcelModule,
    AddLawyerModule,
    TableModule,
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
    AppRoutingModule,
    ordreFormationModule,
    SpinBoxModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
