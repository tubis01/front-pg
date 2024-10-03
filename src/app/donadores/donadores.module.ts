import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonadoresRoutingModule } from './donadores-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { DonadorPageComponent } from './pages/donador-page/donador-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DonadorTableComponent } from './components/donador-table/donador-table.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    DonadorPageComponent,
    SearchPageComponent,
    DonadorTableComponent,
  ],
  imports: [
    CommonModule,
    DonadoresRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class DonadoresModule { }
