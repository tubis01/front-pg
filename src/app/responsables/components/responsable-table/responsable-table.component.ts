import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Responsable, HateoasResponse, Links } from '../../interfaces/responsable.interface';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'responsable-table',
  templateUrl: './responsable-table.component.html',
  styleUrl: './responsable-table.component.css'
})
export class ResponsableTableComponent implements OnInit {

   // Lista de responsables
   public responsables: Responsable[] = [];
   // Variables para la paginación
   public currentPage: number = 0;
   public totalPages: number = 1;
   public totalElements: number = 0;
   public pageSize: number = 20;
   // Enlaces HATEOAS
   public links: Links | undefined;

   // Evento para emitir el responsable seleccionado para editar
   @Output() editResponsable = new EventEmitter<Responsable>();

   constructor(private responsableService: ResponsableService) {}

   ngOnInit(): void {
     // Cargar la primera página al inicializar el componente
     this.loadResponsable(this.currentPage);
   }

   // Método para cargar los responsables según la página actual
   loadResponsable(page: number): void {

     this.responsableService.getResponsable(page, this.pageSize)
       .subscribe(
         (response: HateoasResponse<Responsable>) => {
           // Asignar los datos de la respuesta
           this.responsables = response._embedded.datosDetalleResponsableList;
           this.links = response._links;
           this.currentPage = response.page.number;
           this.totalPages = response.page.totalPages;
           this.totalElements = response.page.totalElements;
           console.log('Responsables', this.responsables);

         },
         error => {
           console.error('Error fetching responsables', error);
         }
       );
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
     this.responsableService.getResponsableByUrl(url)
       .subscribe(
         (response: HateoasResponse<Responsable>) => {
           // Asignar los datos de la respuesta
           this.responsables = response._embedded.datosDetalleResponsableList;
           this.links = response._links;
           this.currentPage = response.page.number;
           this.totalPages = response.page.totalPages;
           this.totalElements = response.page.totalElements;
         },
         error => {
           console.error('Error fetching responsables from link', error);
         }
       );
   }

   // Método para seleccionar un responsable para editar
   onEdit(responsable: Responsable): void {
     console.log('Editing responsable', responsable);
     this.editResponsable.emit(responsable);
   }

   // Método para mostrar el mensaje de confirmación antes de eliminar
   confirmDelete(responsable: Responsable): void {
     if (confirm(`¿Estás seguro de que deseas eliminar a ${responsable.nombre} ${responsable.apellido}?`)) {
       this.responsableService.deleteResponsable(responsable.id).subscribe(
         () => {
           this.loadResponsable(this.currentPage); // Recargar la lista de responsables
         },
         error => {
           console.error('Error al eliminar el responsable', error);
         }
       );
     }
   }

}
