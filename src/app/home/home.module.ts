import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LisPageComponent } from './page/lis-page/lis-page.component';
import { LayoutPageComponent } from './page/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { NewPageVoluntarioComponent } from './page/new-page-voluntario/new-page-voluntario.component';
import { NewPageDonadorComponent } from './page/new-page-donador/new-page-donador.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LisPageComponent,
    LayoutPageComponent,
    NewPageVoluntarioComponent,
    NewPageDonadorComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HomeModule { }
