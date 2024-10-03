import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';

const routes: Routes = [{
  path: '',
  component: LayoutPageComponent,
  children: [
    {
      path: 'list',
      component: ListPageComponent
    },
    {
      path: 'new-usuario',
      component: NewPageComponent
    },
    {
      path: 'edit/:id',
      component: NewPageComponent
    },
    {
      path: 'id',
      component: UsuarioPageComponent
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
export class UsuariosRoutingModule { }
