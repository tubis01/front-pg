import { Component, OnInit } from '@angular/core';
import { DatosDetalleDonadorList, HateoasResponse } from '../../interfaces/donador.interface';
import { DonadoresService } from '../../services/donadores.service';

@Component({
  selector: 'donador-table',
  templateUrl: './donador-table.component.html',
  styles: ``
})
export class DonadorTableComponent implements OnInit{

  public donadores: DatosDetalleDonadorList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Solo 5 elementos por página

  constructor (private donadorService: DonadoresService){}

  ngOnInit(): void {
    this.loadDonador(this.currentPage); // Cargar la primera página al inicializar el componente
  }

  loadDonador(page: number): void{
    this.donadorService.getDonadores(page, this.pageSize)
    .subscribe((response: HateoasResponse<DatosDetalleDonadorList>) => {
      this.donadores = response._embedded.datosDetalleDonadorList;
      this.currentPage = response.page.number;
      this.totalPages = response.page.totalPages;
      this.totalElements = response.page.totalElements;
    }
    , error => {
      console.error('Error fetching donadores', error);
    });
  }

}
