import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { MaterialModule } from '../material/material.module';
import { MenuComponent } from './components/menu/menu.component';



@NgModule({
  declarations: [
    Error404PageComponent,
    ToolBarComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    Error404PageComponent,
    ToolBarComponent,
    MenuComponent
  ]
})
export class SharedModule { }
