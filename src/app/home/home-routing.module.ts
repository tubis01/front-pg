import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './page/layout-page/layout-page.component';
import { LisPageComponent } from './page/lis-page/lis-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutPageComponent,
    children: [
      {
        path: 'list',
        component: LisPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
