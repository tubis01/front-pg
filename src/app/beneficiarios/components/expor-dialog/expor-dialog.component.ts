import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';

@Component({
  selector: 'app-expor-dialog',
  templateUrl: './expor-dialog.component.html',
  styleUrl: './expor-dialog.component.css'
})
export class ExporDialogComponent {

// @Output() onExport: EventEmitter<{ idProyecto: number; activo: boolean }> = new EventEmitter();

  public exportForm: FormGroup; // Formulario reactivo
  public visible: boolean = false; // Controla la visibilidad del diálogo
  public proyectos: Proyecto[] = [];  // Proyectos disponibles para el dropdown
  public nextPageUrl: string | null = null; // URL para la siguiente página de beneficiarios


  constructor(private fb: FormBuilder,
      private config: DynamicDialogConfig,
      private ref:  DynamicDialogRef,
      private projectService: ProjectServiceService
    ) {
    this.exportForm = this.fb.group({
      proyecto: ['', Validators.required], // Control para seleccionar proyecto
      activo: [true, Validators.required]  // Control para el estado (activo o inactivo)
    });
  }

  ngOnInit(): void {
    // Recibimos los proyectos desde el data pasado en el Dialog
    this.proyectos = this.config.data.proyectos || [];
    this.nextPageUrl = this.config.data.nextPageUrl || null;


  }



  onConfirm(): void {
    if (this.exportForm.valid) {
      const idProyecto = this.exportForm.get('proyecto')?.value;
      const activo = this.exportForm.get('activo')?.value;
      const exportData = { idProyecto, activo };

      // Cerrar el diálogo y pasar los datos al componente padre
      this.ref.close(exportData);
    } else {
    }
  }

  cargarMasProyectos(): void {
    if (this.nextPageUrl) {
      this.projectService.getProyectoByUrl(this.nextPageUrl).subscribe((response) => {
        const nuevosProyectos = response._embedded.datosDetalleProyectoList;

        // Añadir los nuevos proyectos a la lista de proyectos ya existentes
        this.proyectos = [...this.proyectos, ...nuevosProyectos];

        // Actualizar la URL del siguiente enlace, si lo hay
        this.nextPageUrl = response._links?.next?.href || null;
      }, (error) => {
      });
    }
  }



}
