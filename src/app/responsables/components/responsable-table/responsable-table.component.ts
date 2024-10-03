import { Component } from '@angular/core';
import { DatosDetalleResponsableList, HateoasResponse } from '../../interfaces/responsable.interface';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'responsable-table',
  templateUrl: './responsable-table.component.html',
  styles: ``
})
export class ResponsableTableComponent {

  public responsables: DatosDetalleResponsableList[] = [];
  public currentPage: number = 0;   // Página actual
  public totalPages: number = 1;    // Total de páginas
  public totalElements: number = 0; // Total de registros
  public pageSize: number = 20;      // Solo 5 elementos por página

  constructor( private responsableService: ResponsableService){}

  ngOnInit(): void {
    this.loadResponsable(this.currentPage); // Cargar la primera página al inicializar el componente
  }

  loadResponsable(page: number): void{
    this.responsableService.getResponsable(page, this.pageSize)
    .subscribe((response: HateoasResponse<DatosDetalleResponsableList>) => {
      this.responsables = response._embedded.datosDetalleResponsableList;
      this.currentPage = response.page.number;
      this.totalPages = response.page.totalPages;
      this.totalElements = response.page.totalElements;
    }
    , error => {
      console.error('Error fetching responsables', error);
    });
  }


}
