import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosDetalleDonadorList, HateoasResponse } from '../interfaces/donador.interface';
import { Observable, of, tap } from 'rxjs';
import { environments } from '../../../environments/environment';
import { CacheService } from '../../dashboard/services/cache.service';

@Injectable({providedIn: 'root'})
export class DonadoresService {

  apirUrl: string = environments.baseUrl +  '/donadores';


  constructor( private http: HttpClient, private cacheService: CacheService) { }



  public getDonadores(): Observable<HateoasResponse<DatosDetalleDonadorList>> {
    const cacheKey = `donadores_list`;

    // Verificar si el caché tiene los datos y devolverlos si es así
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    // Realizar la solicitud HTTP y almacenar el resultado en el caché
    return this.http.get<HateoasResponse<DatosDetalleDonadorList>>(`${this.apirUrl}/listar`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, 300000)) // Almacenar en caché por 5 minutos (300000 ms)
    );
  }



  public getDonadorByUrl(url: string): Observable<HateoasResponse<DatosDetalleDonadorList>> {
    return this.http.get<HateoasResponse<DatosDetalleDonadorList>>(url);
  }

  // Agregar un donador
  public addDonador(donador: DatosDetalleDonadorList): Observable<DatosDetalleDonadorList> {
    return this.http.post<DatosDetalleDonadorList>(`${this.apirUrl}/registrar`, donador);
  }

    // Eliminar un donador por ID
    public deleteDonador(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apirUrl}/eliminar/${id}`);
    }
}
