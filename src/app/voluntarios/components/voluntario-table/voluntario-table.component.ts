import { Component, OnInit } from '@angular/core';
import { DatosDetalleVoluntarioList, HateoasResponse } from '../../interfaces/voluntario.interface';
import { VoluntarioService } from '../../services/voluntario.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { CacheService } from '../../../dashboard/services/cache.service';

@Component({
  selector: 'voluntario-table',
  templateUrl: './voluntario-table.component.html',
  styles: ''
})
export class VoluntarioTableComponent implements OnInit{

  public voluntarios: DatosDetalleVoluntarioList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Elementos por página
  public links: any = {};           // Para los enlaces de HATEOAS

  constructor(
    private voluntarioService: VoluntarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.loadVoluntarios(); // Cargar la primera página al inicializar el componente
  }

  loadVoluntarios(): void {
    this.voluntarioService.getVoluntarios().pipe(
      tap((response: HateoasResponse<DatosDetalleVoluntarioList>) => {
        // Procesa la respuesta aquí
        this.voluntarios = response._embedded.datosDetalleVoluntarioList;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.links = response._links; // Guardar los enlaces HATEOAS
      }),
      catchError(error => {
        // Manejo de errores aquí
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los voluntarios.' });
        console.error('Error fetching voluntarios', error);
        return of(); // Retornar un observable vacío para no romper el flujo
      })
    ).subscribe();
  }

  // Confirmar y eliminar un voluntario
  confirmDelete(voluntario: DatosDetalleVoluntarioList): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar al voluntario ${voluntario.nombre} ${voluntario.apellido}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.voluntarioService.deleteDonador(voluntario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Voluntario eliminado correctamente' });
            this.cacheService.delete('voluntarios_lista'); // Eliminar la caché
            this.loadVoluntarios(); // Recargar la lista después de eliminar
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el voluntario.' });
            console.error('Error al eliminar voluntario', err);
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La eliminación fue cancelada.' });
      }
    });
  }


  // Navegar a la primera página
  loadFirstPage(): void {
    if (this.links?.first) {
      this.loadFromLink(this.links.first.href);
    }
  }

  // Navegar a la última página
  loadLastPage(): void {
    if (this.links?.last) {
      this.loadFromLink(this.links.last.href);
    }
  }

  // Navegar a la página siguiente
  loadNextPage(): void {
    if (this.links?.next) {
      this.loadFromLink(this.links.next.href);
    }
  }

  // Navegar a la página anterior
  loadPrevPage(): void {
    if (this.links?.prev) {
      this.loadFromLink(this.links.prev.href);
    }
  }

  // Cargar voluntarios desde un enlace HATEOAS
  loadFromLink(url: string): void {
    this.voluntarioService.getVoluntarioByUrl(url).subscribe({
      next: (response: HateoasResponse<DatosDetalleVoluntarioList>) => {
        this.voluntarios = response._embedded.datosDetalleVoluntarioList;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.links = response._links;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los voluntarios desde el enlace.' });
        console.error('Error fetching voluntarios from link', error);
      }
    });
  }
}
