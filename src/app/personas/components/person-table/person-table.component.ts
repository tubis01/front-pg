import { Component, Input, OnInit } from '@angular/core';
import { PersonService } from '../../services/persons.service';
import { DatosDetallePersonaList, HateoasResponse } from '../../interfaces/persona.interface';

@Component({
  selector: 'person-table',
  templateUrl: './person-table.component.html',
  styles: ``
})
export class PersonTableComponent implements OnInit {
  public persons: DatosDetallePersonaList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Solo 5 elementos por página

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPersons(this.currentPage); // Cargar la primera página al inicializar el componente
  }

  // Método para cargar personas según la página actual
  loadPersons(page: number): void {
    this.personService.getPersons(page, this.pageSize).subscribe(
      (response: HateoasResponse<DatosDetallePersonaList>) => {
        this.persons = response._embedded.datosDetallePersonaList;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error => {
        console.error('Error fetching persons', error);
      }
    );
  }

  // Método para manejar el cambio de página en PrimeNG
  onPageChange(event: any): void {
    const page = event.page;  // Página seleccionada
    if (page === 0) {
      this.loadPersons(0); // Si se regresa al inicio, cargar la página 0
    } else {
      this.loadPersons(page);
    }
  }

  // Cargar más datos cuando llegues al final de las primeras 4 páginas
  loadMore(): void {
    const nextPage = this.currentPage + 1;
    if (nextPage < this.totalPages) {
      this.loadPersons(nextPage);
    }
  }

  // Método para calcular la numeración continua de las filas
  getRowNumber(index: number): number {
    return this.currentPage * this.pageSize + index + 1;
  }

  // Verifica si se alcanzó el límite de 4 páginas
  isLoadMoreVisible(): boolean {
    return (this.currentPage + 1) % 4 === 0 && this.currentPage < this.totalPages - 1;
  }

}
