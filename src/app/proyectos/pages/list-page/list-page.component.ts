import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
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


  public selectedProyecto: Proyecto | null = null;

  // Método llamado cuando se selecciona un proyecto para editar
  onEditProyecto(proyecto: Proyecto): void {
    this.selectedProyecto = proyecto;
  }

  // Método llamado cuando se envía el formulario (registro o actualización)
  onFormSubmit(): void {
    this.selectedProyecto = null; // Restablece el formulario después de enviar
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

}
