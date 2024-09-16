import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LayaoutPageComponent } from './pages/layaout-page/layaout-page.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    LayaoutPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule
  ]
})
export class AuthModule { }
