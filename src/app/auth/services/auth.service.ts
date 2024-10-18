import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { AuthResponse, LoginRequest } from '../interfaces/AuthResponse.types';
import { jwtDecode } from 'jwt-decode';
import { environments } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService  {
  private apiUrl: string = environments.baseUrl + '/auth/login'; // URL del endpoint para autenticación
  private tokenKey: string = 'authToken';
  private rolesKey: string = 'userRoles';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkTokenValidity());

  constructor(private http: HttpClient) {}

  private checkTokenValidity(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      // tiempo en minutos
      const tiempo = (decodedToken.exp - currentTime) / 60;
      console.log(tiempo);

      return decodedToken.exp > currentTime; // El token sigue siendo válido
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false; // El token no es válido o no se puede decodificar
    }
  }

  login(usuario: string, contrasena: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { usuario, contrasena };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(this.apiUrl, loginRequest, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('Error al iniciar sesión. Por favor, inténtelo de nuevo.'));
      })
    );
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true); // Notificar que el usuario está logueado
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setRoles(roles: string[]): void {
    sessionStorage.setItem(this.rolesKey, JSON.stringify(roles));
  }

  getRoles(): string[] {
    const roles = sessionStorage.getItem(this.rolesKey);
    return roles ? JSON.parse(roles) : [];
  }

  setUserName(userName: string): void {
    sessionStorage.setItem('userName', userName);
  }

  getUserName(): string | null {
    return sessionStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue(); // Verificar el estado actual del `BehaviorSubject`
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable(); // Devolver un observable para suscribirse
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.rolesKey);
    sessionStorage.removeItem('userName');
    this.isLoggedInSubject.next(false); // Notificar que el usuario ha cerrado sesión
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
