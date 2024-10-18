import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariosRoutingModule } from './beneficiarios-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { BeneficiarioTableComponent } from './components/beneficiario-table/beneficiario-table.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ExporDialogComponent } from './components/expor-dialog/expor-dialog.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    ListPageComponent,
    BeneficiarioTableComponent,
    ExporDialogComponent
  ],
  imports: [
    CommonModule,
    BeneficiariosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports:[
    ExporDialogComponent
  ]
})
export class BeneficiariosModule { }
