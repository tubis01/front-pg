import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatosDetalleDonadorList } from '../../../donadores/interfaces/donador.interface';
import { Persona } from '../../interfaces/persona.interface';
import { PersonService } from '../../services/persons.service';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: `./list-page.component.css`
})
export class ListPageComponent implements OnInit{

  public canEdit: boolean =  false;
  public canViewTable: boolean = false;
  public canViewForm: boolean = false;


  constructor(

    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermission();
  }

  setPermission(): void{
    const roles = this.authService.getRoles();
    if(roles.includes('ROLE_ADMIN')){
      this.canEdit = true;
      this.canViewTable = true;
      this.canViewForm = true;
    }else if(roles.includes('ROLE_USER')){
      this.canViewTable = true;
    }
  }

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
