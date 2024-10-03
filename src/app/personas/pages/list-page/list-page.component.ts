import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatosDetalleDonadorList } from '../../../donadores/interfaces/donador.interface';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {

  public persons: DatosDetalleDonadorList[] = [];


}
