import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsablesRoutingModule } from './responsables-routing.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ResponsableTableComponent } from './components/responsable-table/responsable-table.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    NewPageComponent,
    ListPageComponent,
    LayoutPageComponent,
    ResponsableTableComponent
  ],
  imports: [
    CommonModule,
    ResponsablesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
],
exports:[
  ResponsableTableComponent,
  NewPageComponent
]
})
export class ResponsablesModule { }
