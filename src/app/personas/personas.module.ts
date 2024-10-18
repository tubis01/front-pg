import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { PersonTableComponent } from './components/person-table/person-table.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YesNoPipe } from './pipes/booleanYesNo.pipe';


@NgModule({
  declarations: [
    ListPageComponent,
    NewPageComponent,
    LayoutPageComponent,
    PersonTableComponent,

    // pipe
    YesNoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    PersonasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,

  ]
})
export class PersonasModule { }
