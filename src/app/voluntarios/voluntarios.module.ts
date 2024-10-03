import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoluntariosRoutingModule } from './voluntarios-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { VoluntarioPageComponent } from './pages/voluntario-page/voluntario-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { VoluntarioTableComponent } from './components/voluntario-table/voluntario-table.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    VoluntarioPageComponent,
    SearchPageComponent,
    VoluntarioTableComponent
  ],
  imports: [
    CommonModule,
    VoluntariosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class VoluntariosModule { }
