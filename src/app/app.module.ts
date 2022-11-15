import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppPagesComponent } from './components/app-pages/app-pages.component';
import { AddUsersComponent } from './components/app-pages/add-users/add-users.component';

@NgModule({
  declarations: [
    AppComponent,
    AppPagesComponent,
    AddUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
