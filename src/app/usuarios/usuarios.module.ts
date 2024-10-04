import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    UsuarioPageComponent,
    UserTableComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UsuariosModule { }
