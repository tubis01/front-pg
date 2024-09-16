import { Component, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {
  
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e:any): void {
      this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

}
