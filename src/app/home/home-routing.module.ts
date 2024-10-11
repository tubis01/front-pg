import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './page/layout-page/layout-page.component';
import { LisPageComponent } from './page/lis-page/lis-page.component';
import { NewPageDonadorComponent } from './page/new-page-donador/new-page-donador.component';
import { NewPageVoluntarioComponent } from './page/new-page-voluntario/new-page-voluntario.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: LisPageComponent
      },
      {
        path: 'donador-form',
        component: NewPageDonadorComponent
      },
      {
        path: 'voluntario-form',
        component: NewPageVoluntarioComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
