import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsablesRoutingModule } from './responsables-routing.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ResponsablePageComponent } from './pages/responsable-page/responsable-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ResponsableTableComponent } from './components/responsable-table/responsable-table.component';
import { materialize } from 'rxjs';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    NewPageComponent,
    ListPageComponent,
    SearchPageComponent,
    ResponsablePageComponent,
    LayoutPageComponent,
    ResponsableTableComponent
  ],
  imports: [
    CommonModule,
    ResponsablesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class ResponsablesModule { }
