import { NgModule } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { TimerComponent } from './components/timer/timer.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { DownloadComponent } from './pages/download/download.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';

@NgModule({
  declarations: [
    AppComponent,
    AppPagesComponent,
    AddUsersComponent,
    TimerComponent,
    AccueilComponent,
    RsvpComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    MenuModuleModule,
    RouterModule,
    SectionModule,
    HttpClientModule,
    ImageModule,
    RouterModule,
    ExcelModule,
    AppRoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
