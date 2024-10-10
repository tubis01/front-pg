import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuard } from './auth/services/auth.guard';
import { SearchBoxComponent } from './shared/components/search-box/search-box.component';

const routes: Routes = [
  {
    path: 'search',
    component: SearchBoxComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then (m => m.AuthModule)
  },
  {
    path: 'person',
    loadChildren: () => import('./personas/personas.module').then (m => m.PersonasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'beneficiarios',
    loadChildren: () => import('./beneficiarios/beneficiarios.module').then ( m => m.BeneficiariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'donadores',
    loadChildren: () => import('./donadores/donadores.module').then ( m => m.DonadoresModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'proyectos',
    loadChildren: () => import('./proyectos/proyectos.module').then ( m => m.ProyectosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'responsables',
    loadChildren: () => import('./responsables/responsables.module').then ( m => m.ResponsablesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then ( m => m.UsuariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voluntarios',
    loadChildren: () => import('./voluntarios/voluntarios.module').then ( m => m.VoluntariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tablero',
    loadChildren: () => import('./dashboard/dashboard.module').then ( m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
