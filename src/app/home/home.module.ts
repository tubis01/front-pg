import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LisPageComponent } from './page/lis-page/lis-page.component';
import { LayoutPageComponent } from './page/layout-page/layout-page.component';
import { SharedModule } from 'primeng/api';
import { MaterialModule } from '../material/material.module';
import { DonadoresModule } from '../donadores/donadores.module';
import { VoluntariosModule } from '../voluntarios/voluntarios.module';


@NgModule({
  declarations: [
    LisPageComponent,
    LayoutPageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
  ]
})
export class HomeModule { }
