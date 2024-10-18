import { Injectable } from '@angular/core';
import { Beneficiario, HateoasResponse, UpdateBeneficiario } from '../interfaces/beneficiario.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private apiUrl: string = environments.baseUrl+'/beneficiarios';

  constructor(private http: HttpClient, private cacheService: CacheService) {}


  public getBeneficiarios(): Observable<HateoasResponse<Beneficiario>> {
    const cacheKey = 'beneficiarios_listar';

    // Verificar si los datos están en el caché y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      console.log('Datos benficiarios obtenidos del caché');
      return of(this.cacheService.get(cacheKey));
    }
    console.log('Datos beneficiarios obtenidos del servidor');

    // Realizar la solicitud HTTP y almacenar el resultado en el caché
    return this.http.get<HateoasResponse<Beneficiario>>(`${this.apiUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Tiempo de vida del caché en milisegundos (5 minutos)
    );
  }


  public getBeneficiarioByUrl(url: string): Observable<HateoasResponse<Beneficiario>> {
    return this.http.get<HateoasResponse<Beneficiario>>(url);
  }

  public addBeneficiario(beneficiario: Beneficiario): Observable<Beneficiario> {
    return this.http.post<Beneficiario>(`${this.apiUrl}/registrar`, beneficiario);
  }

  public updateBeneficiario(beneficiario: UpdateBeneficiario): Observable<Beneficiario> {
    return this.http.put<Beneficiario>(`${this.apiUrl}/modificar`, beneficiario);
  }

  public deleteBeneficiario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }


  buscarPorDpiParcial(dpi: string, page: number, size: number): Observable<Beneficiario[]> {
    const params = new HttpParams()
      .set('dpi', dpi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Beneficiario[]>(`${this.apiUrl}/buscarDpiParcial`, { params });
  }
}
