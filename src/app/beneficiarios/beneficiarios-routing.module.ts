import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { authGuard } from '../auth/services/auth.guard';

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
        component: NewPageComponent,
        canActivate: [authGuard],
        data: {
          roles: ['ROLE_DIGITADOR', 'ROLE_ADMIN']
        }
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
