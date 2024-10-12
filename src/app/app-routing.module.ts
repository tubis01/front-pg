import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { authGuard } from './auth/services/auth.guard';
import { SearchBoxComponent } from './shared/components/search-box/search-box.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then (m => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then (m => m.AuthModule)
  },
  {
    path: 'person',
    loadChildren: () => import('./personas/personas.module').then (m => m.PersonasModule),
    canActivate: [authGuard]
  },
  {
    path: 'beneficiarios',
    loadChildren: () => import('./beneficiarios/beneficiarios.module').then ( m => m.BeneficiariosModule),
    canActivate: [authGuard]
  },
  {
    path: 'donadores',
    loadChildren: () => import('./donadores/donadores.module').then ( m => m.DonadoresModule),
    canActivate: [authGuard]
  },
  {
    path: 'proyectos',
    loadChildren: () => import('./proyectos/proyectos.module').then ( m => m.ProyectosModule),
    canActivate: [authGuard]
  },
  {
    path: 'responsables',
    loadChildren: () => import('./responsables/responsables.module').then ( m => m.ResponsablesModule),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then ( m => m.UsuariosModule),
    canActivate: [authGuard]
  },
  {
    path: 'voluntarios',
    loadChildren: () => import('./voluntarios/voluntarios.module').then ( m => m.VoluntariosModule),
    canActivate: [authGuard]
  },
  {
    path: 'tablero',
    loadChildren: () => import('./dashboard/dashboard.module').then ( m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
