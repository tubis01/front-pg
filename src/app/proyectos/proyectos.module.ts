import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosRoutingModule } from './proyectos-routing.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProyectoPageComponent } from './pages/proyecto-page/proyecto-page.component';
import { SharedModule } from "../shared/shared.module";
import { ProjectTableComponent } from './components/project-table/project-table.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    ListPageComponent,
    LayoutPageComponent,
    ProyectoPageComponent,
    ProjectTableComponent
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
]
})
export class ProyectosModule { }
