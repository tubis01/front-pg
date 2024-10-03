import { Component, OnInit } from '@angular/core';
import { DatosDetalleVoluntarioList, HateoasResponse } from '../../interfaces/voluntario.interface';
import { VoluntarioService } from '../../services/voluntario.service';

@Component({
  selector: 'voluntario-table',
  templateUrl: './voluntario-table.component.html',
  styles: ``
})
export class VoluntarioTableComponent implements OnInit{

  public voluntarios: DatosDetalleVoluntarioList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Solo 5 elementos por página

  constructor (private voluntarioService: VoluntarioService){}

  ngOnInit(): void {
    this.loadVoluntario(this.currentPage); // Cargar la primera página al inicializar el componente
  }


  loadVoluntario(page: number): void{
    this.voluntarioService.getVoluntarios(page, this.pageSize)
    .subscribe((response: HateoasResponse<DatosDetalleVoluntarioList>) => {
      this.voluntarios = response._embedded.datosDetalleVoluntarioList;
      this.currentPage = response.page.number;
      this.totalPages = response.page.totalPages;
      this.totalElements = response.page.totalElements;
    }
    , error => {
      console.error('Error fetching voluntarios', error);
    });
  }

}
