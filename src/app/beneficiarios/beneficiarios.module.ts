import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariosRoutingModule } from './beneficiarios-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { BeneficiarioPageComponent } from './pages/beneficiario-page/beneficiario-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    ListPageComponent,
    BeneficiarioPageComponent
  ],
  imports: [
    CommonModule,
    BeneficiariosRoutingModule
  ]
})
export class BeneficiariosModule { }
