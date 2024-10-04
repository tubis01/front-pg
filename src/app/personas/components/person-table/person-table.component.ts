import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonService } from '../../services/persons.service';
import { Persona, HateoasResponse, Links } from '../../interfaces/persona.interface';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'person-table',
  templateUrl: './person-table.component.html',
  styleUrl: `./person-table.component.css`
})
export class PersonTableComponent implements OnInit {
  public persons: Persona[] = [];
  public selectedPerson: Persona | null = null;

  @Output()
  editPerson = new EventEmitter<Persona>();

  public links: Links | undefined;
  public currentPage: number = 0; // Página actual
  public totalPages: number = 1; // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20; // Tamaño de página

  constructor(private personService: PersonService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPersons(this.currentPage); // Cargar la primera página al inicializar el componente
  }

  // Método para cargar personas según la página actual
  loadPersons(page: number): void {
    this.personService.getPersons(page, this.pageSize).subscribe(
      (response: HateoasResponse<Persona>) => {
        if (response._embedded && response._embedded.datosDetallePersonaList) {
          this.persons = response._embedded.datosDetallePersonaList;
        }
        this.links = response._links; // Asignar los enlaces HATEOAS
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        console.log('Persons loaded', this.persons);

      },
      error => {
        console.error('Error fetching persons', error);
      }
    );
  }



  // Método para seleccionar una persona para editar
  onEdit(person: Persona): void {// Copia de la persona para editar
    console.log('Editing person', person);
    this.editPerson.emit(person); // Emitir evento para editar en el componente padre
  }

  // Método para cancelar la edición
  onCancelEdit(): void {
    this.selectedPerson = null; // Descartar la edición
  }

  // Método para enviar los cambios al backend
  onSubmitUpdate(): void {
    if (this.selectedPerson) {
      this.personService.updatePerson( this.selectedPerson).subscribe(
        (response) => {
          this.loadPersons(this.currentPage); // Recargar la lista de personas
          this.selectedPerson = null; // Limpiar la selección
        },
        (error) => {
          console.error('Error updating person', error);
        }
      );
    }
  }


    // Método para mostrar el mensaje de confirmación antes de eliminar
    confirmDelete(person: Persona): void {
      if (confirm(`¿Estás seguro de que deseas eliminar a ${person.primerNombre} ${person.primerApellido}?`)) {
        this.personService.deletePerson(person.DPI).subscribe(
          () => {
            this.loadPersons(this.currentPage); // Recargar la lista de personas
          },
          (error) => {
            console.error('Error al eliminar la persona', error);
          }
        );
      }
    }

  // Método para manejar el cambio de página en la tabla
  onPageChange(event: any): void {
    const page = event.page; // Página seleccionada
    this.loadPersons(page);
  }

  // Método para cargar la primera página
  loadFirstPage(): void {
    if (this.links?.first) {
      this.loadFromLink(this.links.first.href);
    }
  }

  // Método para cargar la última página
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

  // Método para cargar desde un enlace
  loadFromLink(url: string): void {
    this.personService.getPersonsByUrl(url).subscribe(
      (response: HateoasResponse<Persona>) => {
        if (response._embedded && response._embedded.datosDetallePersonaList) {
          this.persons = response._embedded.datosDetallePersonaList;
        }
        this.links = response._links; // Asignar los enlaces HATEOAS
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error => {
        console.error('Error fetching persons from link', error);
      }
    );
  }


}
