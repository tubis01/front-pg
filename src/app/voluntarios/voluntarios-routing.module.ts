import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { VoluntarioPageComponent } from './pages/voluntario-page/voluntario-page.component';

const routes: Routes = [
{
  path: '',
  component: LayoutPageComponent,
  children:[
    {
      path: 'list',
      component: ListPageComponent

    },
    {
      path: 'new-voluntario',
      component: NewPageComponent

    },
    {
      path: 'search',
      component: SearchPageComponent

    },
    {
      path: 'edit/:id',
      component: NewPageComponent

    },
    {
      path: 'id',
      component: VoluntarioPageComponent

    },
    {
      path: '**',
      redirectTo: 'list'

    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoluntariosRoutingModule { }
