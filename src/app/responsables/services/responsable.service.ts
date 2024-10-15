import { Injectable, OnInit } from '@angular/core';
import { Responsable, HateoasResponse } from '../interfaces/responsable.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResponsableService {

  private apiUrl: string = 'http://localhost:8081/responsables';

  constructor(private http: HttpClient) {}

  public getResponsable(page: number = 0, size: number = 20): Observable<HateoasResponse<Responsable>> {
    return this.http.get<HateoasResponse<Responsable>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
  }

  public getAallResponsable(): Observable<HateoasResponse<Responsable>> {
    return this.http.get<HateoasResponse<Responsable>>(`${this.apiUrl}/listar`);
  }

  public getResponsableByUrl(url: string): Observable<HateoasResponse<Responsable>> {
    return this.http.get<HateoasResponse<Responsable>>(url);
  }

  public buscarPorNombre(termi: string, page: number, size: number ): Observable<Responsable[]> {
    const params = new HttpParams()
      .set('term', termi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Responsable[]>(`${this.apiUrl}/buscarPorNombre`, { params });
  }


  public addResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.post<Responsable>(`${this.apiUrl}/registrar`, responsable);
  }

  //   public addResponsable(encryptedData: string): Observable<Responsable> {
  //   return this.http.post<Responsable>(`${this.apiUrl}/registrar`, encryptedData);
  // }

  public updateResponsable(responsable: Responsable): Observable<Responsable> {
    return this.http.put<Responsable>(`${this.apiUrl}/modificar`, responsable);
  }

  public deleteResponsable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }


}
