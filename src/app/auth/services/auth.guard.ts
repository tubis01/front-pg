import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';  // Necesario para inyectar dependencias en funciones

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inyectamos el AuthService
  const router = inject(Router);  // Inyectamos el Router

  // Verificamos si el usuario está autenticado
  if (authService.isLoggedIn()) {
    const roles = authService.getRoles();  // Obtenemos los roles del usuario

    // Si el usuario tiene el rol ROLE_DIGITADOR, lo redirigimos al formulario de beneficiario
    if (roles.includes('ROLE_DIGITADOR') && state.url !== '/beneficiarios/new-beneficiario') {
      console.log('Redirigiendo ROLE_DIGITADOR a /beneficiarios/new-beneficiario');
      router.navigate(['/beneficiarios/new-beneficiario']);
      return false;  // Detener la navegación actual
    }
    // Verificamos si la ruta tiene roles esperados, y si el usuario no tiene ninguno, lo redirigimos
    if (route.data['roles'] && !route.data['roles'].some((role: string) => roles.includes(role))) {
      router.navigate(['/unauthorized']);  // Redirigimos a una página de acceso denegado si no tiene permisos
      return false;
    }

    return true;  // Si el usuario tiene el rol requerido, permitimos la navegación
  } else {
    router.navigate(['/login']);  // Si no está autenticado, lo redirigimos al login
    return false;
  }
};
