import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatosDetalleDonadorList } from '../../../donadores/interfaces/donador.interface';
import { Persona } from '../../interfaces/persona.interface';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {

  public persons: DatosDetalleDonadorList[] = [];

  public selectedPerson: Persona | null = null;

  // Método que se llama cuando se selecciona una persona para editar
  onEditPerson(person: Persona): void {
    this.selectedPerson = person;
  }

  // Método que se llama cuando se envía el formulario (registro o actualización)
  onFormSubmit(): void {
    // Restablecer el formulario después de guardar o actualizar
    this.selectedPerson = null;
  }
}
