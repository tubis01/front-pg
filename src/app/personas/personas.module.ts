import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { PeronaPageComponent } from './pages/perona-page/perona-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { PersonTableComponent } from './components/person-table/person-table.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListPageComponent,
    SearchPageComponent,
    NewPageComponent,
    PeronaPageComponent,
    LayoutPageComponent,
    PersonTableComponent
  ],
  imports: [
    CommonModule,

    PersonasRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class PersonasModule { }
