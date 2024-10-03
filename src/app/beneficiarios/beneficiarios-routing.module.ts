import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { BeneficiarioPageComponent } from './pages/beneficiario-page/beneficiario-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'list',
        component: ListPageComponent
      },
      {
        path: 'new-beneficiario',
        component: NewPageComponent
      },
      {
        path: 'edit/:id',
        component: NewPageComponent
      },
      {
        path: ':id',
        component: BeneficiarioPageComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiariosRoutingModule { }
