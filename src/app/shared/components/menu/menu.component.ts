import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {


  public userName: string | null = '';
  public isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  public sidebarVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.subscription = this.authService.getIsLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.userName = this.authService.getUserName(); // Obtener el nombre del usuario si está logueado
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  public closeSidebar(): void {
    this.sidebarVisible = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Desuscribirse para evitar pérdidas de memoria
    }
  }

}
