import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, HateoasResponse } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl: string = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) {}

  public listarUsuarios(page: number = 0, size: number = 20): Observable<HateoasResponse<Usuario>> {
    return this.http.get<HateoasResponse<Usuario>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

  public listarUsuariosInactivos(page: number = 0, size: number = 20): Observable<HateoasResponse<Usuario>> {
    return this.http.get<HateoasResponse<Usuario>>(`${this.apiUrl}/listarInactivos?page=${page}&size=${size}`);
  }

  public registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, usuario);
  }

  public actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/actualizar`, usuario);
  }

  public deshabilitarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deshabilitar/${id}`);
  }

  public listarUsuariosByUrl(url: string): Observable<HateoasResponse<Usuario>> {
    return this.http.get<HateoasResponse<Usuario>>(url);
  }
}
