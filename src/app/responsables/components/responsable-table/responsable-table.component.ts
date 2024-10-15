import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Responsable, HateoasResponse, Links } from '../../interfaces/responsable.interface';
import { ResponsableService } from '../../services/responsable.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'responsable-table',
  templateUrl: './responsable-table.component.html',
  styleUrl: './responsable-table.component.css'
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadResponsable(this.currentPage);
  }

  // Método para cargar los responsables según la página actual
  loadResponsable(page: number): void {
    this.responsableService.getResponsable(page, this.pageSize).subscribe({
      next: (response: HateoasResponse<Responsable>) => {
        this.responsables = response._embedded.datosDetalleResponsableList;
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching responsables', error);
      }
    });
  }

  // Método para confirmar antes de editar un responsable
  onEdit(responsable: Responsable): void {
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
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Edición del responsable ${responsable.nombre} cancelada.` });
        this.isProcessing = false;
      }
    });
  }

  // Método para confirmar antes de eliminar un responsable
  confirmDelete(responsable: Responsable): void {
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
            this.loadResponsable(this.currentPage); // Recargar la lista de responsables
            this.isProcessing = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el responsable.' });
            this.isProcessing = false;
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Eliminación del responsable ${responsable.nombre} cancelada.` });
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
          console.error('Error al buscar beneficiarios por DPI parcial:', err);
        }
      });
    } else {
      // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
      this.loadResponsable(this.currentPage);
      this.isLoading = false;
    }
  }


  // Método para manejar el cambio de página en la tabla
  onPageChange(event: any): void {
    const page = event.page;
    this.loadResponsable(page);
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
    this.responsableService.getResponsableByUrl(url).subscribe({
      next: (response: HateoasResponse<Responsable>) => {
        this.responsables = response._embedded.datosDetalleResponsableList;
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching responsables from link', error);
      }
    });
  }
 }

