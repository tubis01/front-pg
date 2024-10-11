import { Component, OnInit } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { HttpClient } from '@angular/common/http';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public proyectos: Proyecto[] = [];

  constructor( private projectService: ProjectServiceService) { }


  ngOnInit(): void {
    this.loadProjects();
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




  public selectedBeneficiario: Beneficiario | null = null;

  onEditBeneficiario(beneficiario: Beneficiario): void {
    // Al hacer clic en editar, se asigna el beneficiario para editar al formulario
    this.selectedBeneficiario = beneficiario;
  }

  onFormSubmit(): void {
    // Se resetea el formulario después de enviarlo correctamente
    this.selectedBeneficiario = null;
  }

}
