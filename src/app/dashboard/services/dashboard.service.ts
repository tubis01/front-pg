import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto.interface';
import { environments } from '../../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({providedIn: 'root'})
export class DashboardService {


  private readonly apiUrl = environments.baseUrl + '/reporte';

  constructor(private http: HttpClient, private cacheService: CacheService) {}
  contarProyectosPorEstado(estado: string): Observable<number> {
    const cacheKey = `proyectosPorEstado_${estado}`;
    const ttl = 300000; // 5 minutos

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    const params = new HttpParams().set('estado', estado);
    return this.http.get<number>(`${this.apiUrl}/proyectosPorEstado`, { params }).pipe(
      tap(data => this.cacheService.set(cacheKey, data, ttl)) // Almacenar en caché por 5 minutos
    );
  }


  contarBeneficiariosPorMes(mes: number): Observable<number> {
    const cacheKey = `beneficiariosMes_${mes}`;
    const ttl = 3600000; // 1 hora

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    const params = new HttpParams().set('mes', mes.toString());
    return this.http.get<number>(`${this.apiUrl}/beneficiariosPorMes`, { params }).pipe(
      tap(data => this.cacheService.set(cacheKey, data, ttl))
    );
  }

  obtenerUltimosProyectosFinalizados(cantidad: number = 5): Observable<Proyecto[]> {
    const cacheKey = `ultimosProyectosFinalizados_${cantidad}`;
    const ttl = 1800000; // 30 minutos

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    const params = new HttpParams().set('cantidad', cantidad.toString());
    return this.http.get<Proyecto[]>(`${this.apiUrl}/ultimos-proyectos-finalizados`, { params }).pipe(
      tap(data => this.cacheService.set(cacheKey, data, ttl))
    );
  }

  obtenerTotalBeneficiarios(): Observable<number> {
    const cacheKey = 'totalBeneficiarios';
    const ttl = 86400000; // 24 horas

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    return this.http.get<number>(`${this.apiUrl}/totalBeneficiarios`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, ttl))
    );
  }
}
