import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

  constructor(private fb: FormBuilder,
      private config: DynamicDialogConfig,
      private ref:  DynamicDialogRef
    ) {
    this.exportForm = this.fb.group({
      proyecto: ['', Validators.required], // Control para seleccionar proyecto
      activo: [true, Validators.required]  // Control para el estado (activo o inactivo)
    });
  }

  ngOnInit(): void {
    // Recibimos los proyectos desde el data pasado en el Dialog
    this.proyectos = this.config.data.proyectos || [];
    console.log('Proyectos en export dialog', this.proyectos);

  }


  onConfirm(): void {
    console.log('Exportar ha sido presionado');
    if (this.exportForm.valid) {
      const idProyecto = this.exportForm.get('proyecto')?.value;
      const activo = this.exportForm.get('activo')?.value;
      const exportData = { idProyecto, activo };
      console.log('Datos a exportar:', exportData);

      // Cerrar el diálogo y pasar los datos al componente padre
      this.ref.close(exportData);
    } else {
      console.log('Formulario no válido');
    }
  }





}
