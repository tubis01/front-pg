import { Component, OnInit } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { HttpClient } from '@angular/common/http';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'beneficiarios-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public proyectos: Proyecto[] = [];
  public selectedBeneficiario: Beneficiario | null = null;
  public nextPageUrl: string | null = null;



  // implementacion de permisos para usuarios
  public canEdit: boolean =  false;
  public canViewTable: boolean = false;
  public canViewForm: boolean = false;
  public canDelete: boolean = false;




  constructor(
    private projectService: ProjectServiceService,
    private AuthService: AuthService
  ) { }


  ngOnInit(): void {

    this.setPermission();
    if (this.canEdit && this.canDelete) {
      this.loadProjects();
      }
  }

  private requesCounter: number = 0;
  loadProjects(): void {

    this.requesCounter++;

    this.projectService.listarProyectos().subscribe({
      next: (response) => {
        this.proyectos = response._embedded.datosDetalleProyectoList;
        this.nextPageUrl = response._links.next?.href || null;


      },
      error: (error) => {
        console.error('Error al cargar proyectos', error);
      }
    });

  }

  setPermission(): void{
    const roles = this.AuthService.getRoles();
    if(roles.includes('ROLE_ADMIN')){
      this.canEdit = true;
      this.canViewTable = true;
      this.canViewForm = true;
      this.canDelete = true;
    }else if (roles.includes('ROLE_RESPONSABLE')) {
      this.canViewTable = true;
      this.canDelete = true;
    } else if(roles.includes('ROLE_USER')){
      this.canViewTable = true;
    }else if(roles.includes('ROLE_DIGITADOR')){
      this.canViewForm = true;
  }


}


  onEditBeneficiario(beneficiario: Beneficiario): void {
    // Al hacer clic en editar, se asigna el beneficiario para editar al formulario
    this.selectedBeneficiario = beneficiario;
  }

  onFormSubmit(): void {
    // Se resetea el formulario después de enviarlo correctamente
    this.selectedBeneficiario = null;
  }

}
