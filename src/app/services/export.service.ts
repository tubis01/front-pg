import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ExportService {
  private apiUrl = environments.baseUrl + '/export/benenficiarios'; // URL del endpoint

  constructor(private http: HttpClient) {}

  exportBeneficiarios(idProyecto: number, activo: boolean): Observable<Blob> {
    const params = { idProyecto: idProyecto.toString(), activo: activo.toString() };

    return this.http.get(`${this.apiUrl}`, {
      params,
      responseType: 'blob'  // Indica que la respuesta será un archivo binario
    });
  }


  


}
