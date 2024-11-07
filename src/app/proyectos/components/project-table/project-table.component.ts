import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HateoasResponse, Links, Proyecto } from '../../interfaces/proyecto.interface';
import { ProjectServiceService } from '../../services/projects.service';
import { Observer } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CacheService } from '../../../dashboard/services/cache.service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styles: ''
})
export class ProjectTableComponent implements OnInit{

  public proyectos: Proyecto[] = [];

  public links: Links | undefined;
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;

  public isLoading: boolean = false;

  @Output() editProyecto = new EventEmitter<Proyecto>();
  @Input() canEdit: boolean = false;

  private isProcessing: boolean = false;

  constructor(
    private proyectoService: ProjectServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cacheServicer: CacheService
  ) {}

  ngOnInit(): void {
    this.loadProyectos();
  }

  // Cargar proyectos según la página actual
  loadProyectos(): void {
    this.isLoading = true;
    this.proyectoService.listarProyectos().subscribe({
      next: (response: HateoasResponse<Proyecto>) => {
        if (response._embedded?.datosDetalleProyectoList) {
          this.proyectos = response._embedded.datosDetalleProyectoList;
        }
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

  // Método para editar un proyecto
  onEdit(proyecto: Proyecto): void {
    this.isLoading = true;
    if (this.isProcessing) return; // Evitar que se llame más de una vez
    this.isProcessing = true;

    this.confirmationService.confirm({
      message: `¿Deseas editar el proyecto ${proyecto.nombre} ${proyecto.descripcion}?`,
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editProyecto.emit(proyecto);
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: `Edición del proyecto ${proyecto.nombre} iniciada.` });
        this.isProcessing = false;
        this.isLoading = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Edición del proyecto ${proyecto.nombre} cancelada.` });
        this.isProcessing = false;
        this.isLoading = false;
      }
    }); // Emitir el proyecto para editar
  }

  // Método para eliminar un proyecto
  confirmDelete(proyecto: Proyecto): void {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el proyecto ${proyecto.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proyectoService.finalizarProyecto(proyecto.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `El proyecto ${proyecto.nombre} ha sido eliminado.` });
            this.cacheServicer.delete('proyectos_listar'); // Eliminar la caché
            this.loadProyectos(); // Recargar la lista de proyectos
            this.isLoading = false;
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el proyecto.' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.' });
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.isLoading = true;

    if (term && term.trim().length > 0) {
      this.proyectoService.buscarPorNombre(term, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.proyectos = data; // Mostrar los beneficiarios filtrados
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    } else {
      // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
      this.loadProyectos();
      this.isLoading = false;
    }
  }


  // Métodos para la paginación
  onPageChange(event: any): void {
    this.loadProyectos();
  }

  // Método para cambiar de página usando los enlaces HATEOAS
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

loadFromLink(url: string): void {
  this.isLoading = true;
  this.proyectoService.getProyectoByUrl(url).subscribe(
    (response: HateoasResponse<Proyecto>) => {
        this.proyectos = response._embedded.datosDetalleProyectoList;
      this.links = response._links; // Asignar los enlaces HATEOAS
      this.currentPage = response.page.number;
      this.totalPages = response.page.totalPages;
      this.totalElements = response.page.totalElements;
      this.isLoading = false;

    },
    (error) => {
    }
  );
}



}
