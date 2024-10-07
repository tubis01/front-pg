import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HateoasResponse, Links, Proyecto } from '../../interfaces/proyecto.interface';
import { ProjectServiceService } from '../../services/projects.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css'
})
export class ProjectTableComponent implements OnInit{
  public proyectos: Proyecto[] = [];

  public links : Links | undefined;
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;

  @Output() editProyecto = new EventEmitter<Proyecto>();

  constructor(private proyectoService: ProjectServiceService) {}

  ngOnInit(): void {
    this.loadProyectos(this.currentPage);
  }

  // Cargar proyectos según la página actual
  loadProyectos(page: number): void {
    const observer: Observer<HateoasResponse<Proyecto>> = {
      next: (response) => {
        if (response._embedded?.datosDetalleProyectoList) {
          this.proyectos = response._embedded.datosDetalleProyectoList;
        }
        this.links = response._links; // Asignar los enlaces HATEOAS aquí
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching projects', error);
      },
      complete: () => {
        console.log('Load projects complete');
      }
    };

    this.proyectoService.listarProyectos(page, this.pageSize).subscribe(observer);
  }


  // Método para editar un proyecto
  onEdit(proyecto: Proyecto): void {
    console.log('Editing project', proyecto);

    this.editProyecto.emit(proyecto);
  }

  // Método para eliminar un proyecto
  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.proyectoService.finalizarProyecto(id).subscribe(
        () => this.loadProyectos(this.currentPage),
        (error) => console.error('Error deleting project', error)
      );
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


  confirmDelete(proyecto: Proyecto): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el proyecto ${proyecto.nombre}?`)) {
      this.proyectoService.finalizarProyecto(proyecto.id).subscribe({
        next: () => {
          this.loadProyectos(this.currentPage);
        },
        error: (error) => console.error('Error al eliminar el proyecto', error)
      });
    }
  }

}
