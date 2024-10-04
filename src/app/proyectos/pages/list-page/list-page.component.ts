import { Component } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {
  public selectedProyecto: Proyecto | null = null;

  // Método llamado cuando se selecciona un proyecto para editar
  onEditProyecto(proyecto: Proyecto): void {
    this.selectedProyecto = proyecto;
  }

  // Método llamado cuando se envía el formulario (registro o actualización)
  onFormSubmit(): void {
    this.selectedProyecto = null; // Restablece el formulario después de enviar
  }

}
