import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatosDetalleDonadorList } from '../../../donadores/interfaces/donador.interface';
import { Persona } from '../../interfaces/persona.interface';
import { PersonService } from '../../services/persons.service';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: `./list-page.component.css`
})
export class ListPageComponent {


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
