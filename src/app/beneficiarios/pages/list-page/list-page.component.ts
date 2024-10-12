import { Component, OnInit } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { HttpClient } from '@angular/common/http';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public proyectos: Proyecto[] = [];
  public selectedBeneficiario: Beneficiario | null = null;



  // implementacion de permisos para usuarios
  public canEdit: boolean =  false;
  public canViewTable: boolean = false;
  public canViewForm: boolean = false;




  constructor(
    private projectService: ProjectServiceService,
    private AuthService: AuthService
  ) { }


  ngOnInit(): void {
    this.loadProjects();
    this.setPermission();
  }

  loadProjects(): void {
    this.projectService.listarProyectos().subscribe({
      next: (response) => {
        this.proyectos = response._embedded.datosDetalleProyectoList;
        console.log('Proyectos cargados en listPage', this.proyectos);

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
    }else if(roles.includes('ROLE_USER')){
      this.canViewTable = true;
    }else if(roles.includes('ROLE_DIGITADOR')){
      this.canViewForm = true;
  }

  console.log('roles', roles);

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
