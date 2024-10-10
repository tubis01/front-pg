import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { MaterialModule } from '../material/material.module';
import { MenuComponent } from './components/menu/menu.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Error404PageComponent,
    ToolBarComponent,
    MenuComponent,
    SearchBoxComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    Error404PageComponent,
    ToolBarComponent,
    MenuComponent,
    SearchBoxComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
