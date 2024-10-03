import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosRoutingModule } from './proyectos-routing.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProyectoPageComponent } from './pages/proyecto-page/proyecto-page.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    ListPageComponent,
    LayoutPageComponent,
    ProyectoPageComponent
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    SharedModule
]
})
export class ProyectosModule { }
