import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/user.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {


  public selectedUsuario: Usuario | null = null;

  // Método para manejar la selección de un usuario para editar
  onEditUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
  }

  // Método para manejar el envío del formulario
  onFormSubmit(): void {
    this.selectedUsuario = null; // Restablecer la selección después de la actualización o el registro exitoso
  }

}
