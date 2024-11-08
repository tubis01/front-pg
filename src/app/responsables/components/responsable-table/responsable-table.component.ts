import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Responsable, HateoasResponse, Links } from '../../interfaces/responsable.interface';
import { ResponsableService } from '../../services/responsable.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CacheService } from '../../../dashboard/services/cache.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'responsable-table',
  templateUrl: './responsable-table.component.html',
  styles: ''
})
export class ResponsableTableComponent implements OnInit {// Lista de responsables
  // Lista de responsables
  public responsables: Responsable[] = [];
  // Variables para la paginación
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;
  // Enlaces HATEOAS
  public links: Links | undefined;

  public isLoading: boolean = false;

  // Evento para emitir el responsable seleccionado para editar
  @Output() editResponsable = new EventEmitter<Responsable>();
  @Input() canEdit: boolean = false;
  // Bandera de control para evitar llamadas múltiples
  private isProcessing: boolean = false;

  constructor(
    private responsableService: ResponsableService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.loadResponsable();
  }

  // Método para cargar los responsables según la página actual
  // loadResponsable(): void {
  //   this.isLoading = true;
  //   this.responsableService.getResponsable().subscribe({
  //     next: (response: HateoasResponse<Responsable>) => {
  //       this.responsables = response._embedded.datosDetalleResponsableList;
  //       this.links = response._links;
  //       this.currentPage = response.page.number;
  //       this.totalPages = response.page.totalPages;
  //       this.totalElements = response.page.totalElements;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //     }
  //   });
  // }

    loadResponsable(): void {
    this.isLoading = true;
    this.responsableService.getResponsable().pipe(
      tap((response: HateoasResponse<Responsable>) => {
        if (response._embedded && response._embedded.datosDetalleResponsableList) {
          this.responsables = response._embedded.datosDetalleResponsableList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.isLoading = false;
      }),
      catchError((error) => {
        this.isLoading = false;
        return of();
      })
    )
    .subscribe();
  }

  // Método para confirmar antes de editar un responsable
  onEdit(responsable: Responsable): void {
    this.isLoading = true;
    if (this.isProcessing) return; // Evitar que se llame más de una vez
    this.isProcessing = true;

    this.confirmationService.confirm({
      message: `¿Deseas editar al responsable ${responsable.nombre} ${responsable.apellido}?`,
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editResponsable.emit(responsable);
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: `Edición del responsable ${responsable.nombre} iniciada.` });
        this.isProcessing = false;
        this.isLoading = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Edición del responsable ${responsable.nombre} cancelada.` });
        this.isProcessing = false;
        this.isLoading = false;
      }
    });
  }

  // Método para confirmar antes de eliminar un responsable
  confirmDelete(responsable: Responsable): void {
    this.isLoading = true;
    if (this.isProcessing) return; // Evitar que se llame más de una vez
    this.isProcessing = true;

    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar a ${responsable.nombre} ${responsable.apellido}?`,
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.responsableService.deleteResponsable(responsable.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `El responsable ${responsable.nombre} ha sido eliminado.` });
            this.cacheService.delete('responsables_lista'); // Eliminar la caché
            this.loadResponsable(); // Recargar la lista de responsables
            this.isLoading = false;
            this.isProcessing = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el responsable.' });
            this.isLoading = false;
            this.isProcessing = false;
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Eliminación del responsable ${responsable.nombre} cancelada.` });
        this.isLoading = false;
        this.isProcessing = false;
      }
    });

  }

  onSearch(term: string): void {
    this.isLoading = true;

    if (term && term.trim().length > 0) {
      this.responsableService.buscarPorNombre(term, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.responsables = data; // Mostrar los beneficiarios filtrados
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    } else {
      // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
      this.loadResponsable();
      this.isLoading = false;
    }
  }



  // Métodos para cambiar entre páginas utilizando los enlaces HATEOAS
  loadFirstPage(): void {
    if (this.links?.first) {
      this.loadFromLink(this.links.first.href);
    }
  }

  loadLastPage(): void {
    if (this.links?.last) {
      this.loadFromLink(this.links.last.href);
    }
  }

  loadNextPage(): void {
    if (this.links?.next) {
      this.loadFromLink(this.links.next.href);
    }
  }

  loadPrevPage(): void {
    if (this.links?.prev) {
      this.loadFromLink(this.links.prev.href);
    }
  }

  // Método para cargar una página desde un enlace HATEOAS
  loadFromLink(url: string): void {
    this.isLoading = true;
    this.responsableService.getResponsableByUrl(url).subscribe({
      next: (response: HateoasResponse<Responsable>) => {
        this.responsables = response._embedded.datosDetalleResponsableList;
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
      }
    });
  }
 }

