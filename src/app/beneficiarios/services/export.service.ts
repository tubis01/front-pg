import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HateoasResponse } from '../interfaces/beneficiario.interface';
import { Proyecto } from '../../proyectos/interfaces/proyecto.interface';

@Injectable({providedIn: 'root'})
export class ExportService {
  private apiUrl = 'http://localhost:8081/export/benenficiarios'; // URL del endpoint

  constructor(private http: HttpClient) {}

  exportBeneficiarios(idProyecto: number, activo: boolean): Observable<Blob> {
    const params = { idProyecto: idProyecto.toString(), activo: activo.toString() };

    return this.http.get(`${this.apiUrl}`, {
      params,
      responseType: 'blob'  // Indica que la respuesta será un archivo binario
    });
  }


}
