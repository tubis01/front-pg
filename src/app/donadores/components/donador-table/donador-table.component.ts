import { Component, OnInit } from '@angular/core';
import { DatosDetalleDonadorList, HateoasResponse } from '../../interfaces/donador.interface';
import { DonadoresService } from '../../services/donadores.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { CacheService } from '../../../dashboard/services/cache.service';

@Component({
  selector: 'donador-table',
  templateUrl: './donador-table.component.html',
  styles: ''
})
export class DonadorTableComponent implements OnInit{
  public donadores: DatosDetalleDonadorList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Elementos por página
  public links: any = {};           // Para los enlaces de HATEOAS

  public isLoading: boolean = false; // Para mostrar un spinner de carga

  constructor(
    private donadorService: DonadoresService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.loadDonadores(); // Cargar la primera página al inicializar el componente
  }


  loadDonadores(): void {
    this.isLoading = true; // Activar el spinner de carga
    this.donadorService.getDonadores().pipe(
      tap((response: HateoasResponse<DatosDetalleDonadorList>) => {
        // Procesa la respuesta aquí
        this.donadores = response._embedded.datosDetalleDonadorList;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.links = response._links; // Guardar los enlaces HATEOAS
        this.isLoading = false; // Desactivar el spinner de
      }),
      catchError(error => {
        // Manejo de errores aquí
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los donadores.' });
        this.isLoading = false; // Desactivar el spinner de carga
        return of(); // Retornar un observable vacío para no romper el flujo
      })
    ).subscribe();
  }

  // Confirmar y eliminar un donador
  confirmDelete(donador: DatosDetalleDonadorList): void {
    this.isLoading = true; // Activar el spinner de carga
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar al donador ${donador.nombre} ${donador.apellido}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.donadorService.deleteDonador(donador.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Donador eliminado correctamente' });
            this.cacheService.delete('donadores_list'); // Eliminar la caché
            this.loadDonadores(); // Recargar la lista después de eliminar
            this.isLoading = false; // Desactivar el spinner de carga
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el donador.' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La eliminación fue cancelada.' });
        this.isLoading = false; // Desactivar el spinner de carga
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

  // Cargar donadores desde un enlace HATEOAS
  loadFromLink(url: string): void {
    this.donadorService.getDonadorByUrl(url).subscribe({
      next: (response: HateoasResponse<DatosDetalleDonadorList>) => {
        this.donadores = response._embedded.datosDetalleDonadorList;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.links = response._links;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los donadores desde el enlace.' });
      }
    });
  }

}
