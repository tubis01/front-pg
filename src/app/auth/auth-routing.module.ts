import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayaoutPageComponent } from './pages/layaout-page/layaout-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayaoutPageComponent,
    children: [
      {path: 'login', component: LoginPageComponent},
      {path: '**', redirectTo: 'login'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
