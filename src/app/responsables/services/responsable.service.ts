import { Injectable, OnInit } from '@angular/core';
import { DatosDetalleResponsableList, HateoasResponse } from '../interfaces/responsable.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResponsableService implements OnInit {

  private apiUrl: String  = 'http://localhost:8081/responsables';
  constructor( private http: HttpClient ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public getResponsable(page: number = 0, size: number = 20): Observable<HateoasResponse<DatosDetalleResponsableList>> {
    return this.http.get<HateoasResponse<DatosDetalleResponsableList>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

    // Agregar un donador
    public addDonador(donador: DatosDetalleResponsableList): Observable<DatosDetalleResponsableList> {
      return this.http.post<DatosDetalleResponsableList>(`${this.apiUrl}/registrar`, donador);
    }

    // Actualizar un donador existente
    public putDonador(donador: DatosDetalleResponsableList): Observable<DatosDetalleResponsableList> {
      return this.http.put<DatosDetalleResponsableList>(`${this.apiUrl}/modificar`, donador);
    }

    // Obtener un donador por ID
    public getDonadorById(id: number): Observable<DatosDetalleResponsableList> {
      return this.http.get<DatosDetalleResponsableList>(`${this.apiUrl}/detalle/${id}`);
    }
      // Eliminar un donador por ID
      public deleteDonador(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
      }

}
