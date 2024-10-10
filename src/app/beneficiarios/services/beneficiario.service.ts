import { Injectable } from '@angular/core';
import { Beneficiario, HateoasResponse, UpdateBeneficiario } from '../interfaces/beneficiario.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private apiUrl: string = 'http://localhost:8081/beneficiarios';

  constructor(private http: HttpClient) {}

  public getBeneficiarios(page: number = 0, size: number = 20): Observable<HateoasResponse<Beneficiario>> {
    return this.http.get<HateoasResponse<Beneficiario>>(`${this.apiUrl}/listar?page=${page}&size=${size}`);
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

  // para bucar por dpi

  buscarPorDpiParcial(dpi: string, page: number, size: number): Observable<Beneficiario[]> {
    const params = new HttpParams()
      .set('dpi', dpi)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Beneficiario[]>(`${this.apiUrl}/buscarDpiParcial`, { params });
  }
}
