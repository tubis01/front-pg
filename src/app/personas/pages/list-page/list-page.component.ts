import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Person } from '../../interfaces/person.interface';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {

  public persons: Person[] = [];


}
