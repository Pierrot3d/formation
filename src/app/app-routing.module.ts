import { AddLawyerComponent } from './pages/add-lawyer/add-lawyer/add-lawyer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccueilComponent } from './pages/accueil/accueil.component';
import { DownloadComponent } from './pages/download/download.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';
import { TabletestComponent } from './tabletest/tabletest.component';

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
    path: 'add-lawyer',
    component: AddLawyerComponent,
  },

  {
    path: 'rsvp',
    component: RsvpComponent,
  },

  {
    path: 'tabletest',
    component: TabletestComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
