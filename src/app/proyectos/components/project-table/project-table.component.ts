import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HateoasResponse, Links, Proyecto } from '../../interfaces/proyecto.interface';
import { ProjectServiceService } from '../../services/projects.service';
import { Observer } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css'
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

  private isProcessing: boolean = false;

  constructor(
    private proyectoService: ProjectServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProyectos(this.currentPage);
  }

  // Cargar proyectos según la página actual
  loadProyectos(page: number): void {
    this.proyectoService.listarProyectos(page, this.pageSize).subscribe({
      next: (response: HateoasResponse<Proyecto>) => {
        if (response._embedded?.datosDetalleProyectoList) {
          this.proyectos = response._embedded.datosDetalleProyectoList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      }
    });
  }

  // Método para editar un proyecto
  onEdit(proyecto: Proyecto): void {
    if (this.isProcessing) return; // Evitar que se llame más de una vez
    this.isProcessing = true;

    this.confirmationService.confirm({
      message: `¿Deseas editar al responsable ${proyecto.nombre} ${proyecto.descripcion}?`,
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editProyecto.emit(proyecto);
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: `Edición del proyecto ${proyecto.nombre} iniciada.` });
        this.isProcessing = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Edición del proyecto ${proyecto.nombre} cancelada.` });
        this.isProcessing = false;
      }
    }); // Emitir el proyecto para editar
  }

  // Método para eliminar un proyecto
  confirmDelete(proyecto: Proyecto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el proyecto ${proyecto.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proyectoService.finalizarProyecto(proyecto.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: `El proyecto ${proyecto.nombre} ha sido eliminado.` });
            this.loadProyectos(this.currentPage); // Recargar la lista de proyectos
          },
          error: (error) => {
            console.error('Error al eliminar el proyecto', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el proyecto.' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.' });
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
          console.error('Error al buscar beneficiarios por DPI parcial:', err);
        }
      });
    } else {
      // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
      this.loadProyectos(this.currentPage);
      this.isLoading = false;
    }
  }


  // Métodos para la paginación
  onPageChange(event: any): void {
    this.loadProyectos(event.page);
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
  this.proyectoService.getProyectoByUrl(url).subscribe(
    (response: HateoasResponse<Proyecto>) => {
        this.proyectos = response._embedded.datosDetalleProyectoList;
      this.links = response._links; // Asignar los enlaces HATEOAS
      this.currentPage = response.page.number;
      this.totalPages = response.page.totalPages;
      this.totalElements = response.page.totalElements;
      console.log('Loaded projects from link', response);

    },
    (error) => {
      console.error('Error fetching projects from link', error);
    }
  );
}



}
