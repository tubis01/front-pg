import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonService } from '../../services/persons.service';
import { Persona, HateoasResponse, Links } from '../../interfaces/persona.interface';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';


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

  public isLoading: boolean = false;

  constructor(private personService: PersonService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPersons(this.currentPage); // Cargar la primera página al inicializar el componente
  }

  // Método para cargar personas según la página actual
  loadPersons(page: number): void {
    this.personService.getPersons(page, this.pageSize).subscribe({
      next: (response: HateoasResponse<Persona>) => {
        if (response._embedded && response._embedded.datosDetallePersonaList) {
          this.persons = response._embedded.datosDetallePersonaList;
        }
        this.links = response._links; // Asignar los enlaces HATEOAS
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        console.log('Persons loaded', this.persons);
      },
      error: (error) => {
        console.error('Error fetching persons', error);
      }
    });
  }




  // Método para seleccionar una persona para editar
// Método para confirmar antes de editar y asignar la persona seleccionada al formulario
onEdit(person: Persona): void {
  this.confirmationService.confirm({
    message: `¿Estás seguro de que deseas editar a ${person.primerNombre} ${person.primerApellido}?`,
    header: 'Confirmar Edición',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {

      this.selectedPerson = person; // Asignar la persona seleccionada al formulario si se confirma
      this.editPerson.emit(person); // Emitir evento para llenar el formulario
    },
    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Edición Cancelada', detail: 'La operación ha sido cancelada.' });
    }
  });
}



  // Método para cancelar la edición
  onCancelEdit(): void {
    this.selectedPerson = null; // Descartar la edición
  }

  // Método para enviar los cambios al backend
  onSubmitUpdate(): void {
    if (this.selectedPerson) {
      console.log('Updating person', this.selectedPerson);

      this.personService.updatePerson(this.selectedPerson).subscribe({
        next: (response) => {
          this.loadPersons(this.currentPage); // Recargar la lista de personas
          this.selectedPerson = null; // Limpiar la selección
        },
        error: (error) => {
          console.error('Error updating person', error);
        }
      });
    }
  }



    // Método para mostrar el mensaje de confirmación antes de eliminar
    confirmDelete(person: Persona): void {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que deseas eliminar a ${person.primerNombre} ${person.primerApellido}?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.personService.deletePerson(person.DPI).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Persona eliminada con éxito' });
              this.loadPersons(this.currentPage); // Recargar la lista de personas
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
            }
          });
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada' });
        }
      });
    }


    confirmUpdate(): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro de que deseas actualizar esta persona?',
        header: 'Confirmar Actualización',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onSubmitUpdate(); // Llama a la función de actualización
        }
      });
    }

    onSearch(term: string): void {
      this.isLoading = true;

      if (term && term.trim().length > 0) {
        this.personService.buscarPorDpiParcial(term, this.currentPage, this.pageSize)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.persons = data; // Mostrar los beneficiarios filtrados
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error al buscar beneficiarios por DPI parcial:', err);
          }
        });
      } else {
        // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
        this.loadPersons(this.currentPage);
        this.isLoading = false;
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
    this.personService.getPersonsByUrl(url).subscribe({
      next: (response: HateoasResponse<Persona>) => {
        if (response._embedded && response._embedded.datosDetallePersonaList) {
          this.persons = response._embedded.datosDetallePersonaList;
        }
        this.links = response._links; // Asignar los enlaces HATEOAS
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching persons from link', error);
      }
    });
  }



}
