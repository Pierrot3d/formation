import { AppPagesComponent } from './components/app-pages/app-pages.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
  path: '',
  redirectTo: 'accueil',
  pathMatch: 'full',
},
{
  path: 'accueil',
  component: AppPagesComponent,
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
