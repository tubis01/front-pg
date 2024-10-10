import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expor-dialog',
  templateUrl: './expor-dialog.component.html',
  styles: ``
})
export class ExporDialogComponent {
  @Output() onExport: EventEmitter<{ idProyecto: number; activo: boolean }> = new EventEmitter();

  @Input() proyectos: Proyecto[] = []; // Proyectos disponibles

  public exportForm: FormGroup; // Formulario reactivo
  public visible: boolean = false; // Controla la visibilidad del diálogo

  constructor(private fb: FormBuilder) {
    this.exportForm = this.fb.group({
      proyecto: ['', Validators.required], // Control para seleccionar proyecto
      activo: [true, Validators.required]  // Control para el estado (activo o inactivo)
    });
  }

  ngOnInit(): void {}

  onConfirm(): void {
    if (this.exportForm.valid) {
      const idProyecto = this.exportForm.get('proyecto')?.value;
      const activo = this.exportForm.get('activo')?.value;
      this.onExport.emit({ idProyecto, activo });
    }
  }

}
