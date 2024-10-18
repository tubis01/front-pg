import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonadoresRoutingModule } from './donadores-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MaterialModule } from '../material/material.module';
import { DonadorTableComponent } from './components/donador-table/donador-table.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListPageComponent,
    DonadorTableComponent,
  ],
  imports: [
    CommonModule,
    DonadoresRoutingModule,
    MaterialModule,
    SharedModule
]
})
export class DonadoresModule { }
