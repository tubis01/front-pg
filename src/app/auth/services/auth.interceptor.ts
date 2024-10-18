import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Si el token existe, lo agregamos en la cabecera
    if (token && !request.url.includes('/login')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Manejo de errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si el servidor devuelve un 401 (Unauthorized), se asume que el token ha expirado
          this.authService.logout(); // Cerrar sesión
          this.router.navigate(['/login']); // Redirigir al login

          // Mostrar un mensaje de sesión expirada
          this.messageService.add({
            severity: 'warn',
            summary: 'Sesión Expirada',
            detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          });
        }
        return throwError(() => error);
      })
    );
  }
}
