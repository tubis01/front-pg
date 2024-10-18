import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Usuario, HateoasResponse } from '../interfaces/user.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl: string =  environments.baseUrl + '/usuarios';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // public listarUsuarios(page: number = 0, size: number = 20): Observable<HateoasResponse<Usuario>> {
  //   const cacheKey = `usuarios_page_${page}_size_${size}`;

  //   // Verificar si la caché tiene los datos y devolverlos si es así
  //   if (this.cacheService.has(cacheKey)) {
  //     console.log("Datos de usuarios obtenidos de la caché");

  //     return of(this.cacheService.get(cacheKey));
  //   }

  //   console.log('Datos de usuarios obtenidos del servidor');

  //   // Realizar la solicitud HTTP y almacenar el resultado en la caché
  //   return this.http.get<HateoasResponse<Usuario>>(`${this.apiUrl}/listar?page=${page}&size=${size}`).pipe(
  //     tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
  //   );
  // }
  public listarUsuarios(): Observable<HateoasResponse<Usuario>> {
    const cacheKey = 'usuarios_lista';

    // Verificar si los datos están en la caché y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log("Datos de usuarios obtenidos de la caché");
      return of(this.cacheService.get(cacheKey));
    }

    console.log('Datos de usuarios obtenidos del servidor');

    // Realizar la solicitud HTTP y almacenar el resultado en la caché
    return this.http.get<HateoasResponse<Usuario>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en la caché por 5 minutos (300000 ms)
    );
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

  public buscarPorUsuario(termi: string, page: number, size: number ): Observable<Usuario[]> {
    const params = new HttpParams()
      .set('term', termi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Usuario[]>(`${this.apiUrl}/buscarPorNombre`, { params });
  }

}
