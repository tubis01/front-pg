import { ChangeDetectionStrategy, Component} from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shared-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToolBarComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/home'
    },
    { label: 'Iniciar Sesión',
      icon: 'pi pi-user',
      routerLink: '/auth/login' }
  ];

}
