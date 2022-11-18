import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccueilComponent } from './pages/accueil/accueil.component';
import { DownloadComponent } from './pages/download/download.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/accueil',
    pathMatch: 'full',
  },

  {
    path: 'accueil',
    component: AccueilComponent,
  },

  {
    path: 'download',
    component: DownloadComponent,
  },

  {
    path: 'rsvp',
    component: RsvpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
