import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectServiceService } from '../../services/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent {
  @Input() proyectoToEdit: Proyecto | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public proyectoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProjectServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.proyectoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['']
    });
  }

  ngOnInit(): void {
    if (this.proyectoToEdit) {
      this.proyectoForm.patchValue(this.proyectoToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoToEdit'] && changes['proyectoToEdit'].currentValue) {
      this.proyectoForm.patchValue(changes['proyectoToEdit'].currentValue);
    }
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) return;

    if (this.proyectoToEdit?.id) {
      // Mostrar diálogo de confirmación solo en la actualización
      this.confirmationService.confirm({
        message: `¿Estás seguro de que deseas actualizar el proyecto ${this.proyectoForm.value.nombre}?`,
        header: 'Confirmar Actualización',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.updateProyecto();
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La operación ha sido cancelada.' });
        }
      });
    } else {
      // Registrar un nuevo proyecto sin confirmación
      this.createProyecto();
    }
  }

  // Método para actualizar un proyecto
  updateProyecto(): void {
    this.proyectoService.updateProyecto(this.proyectoForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualización Exitosa', detail: `El proyecto ${this.proyectoForm.value.nombre} ha sido actualizado correctamente.` });
        this.formSubmit.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al actualizar el proyecto', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el proyecto.' });
      }
    });
  }

  // Método para registrar un proyecto
  createProyecto(): void {
    this.proyectoService.registrarProyecto(this.proyectoForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: `El proyecto ${this.proyectoForm.value.nombre} ha sido registrado correctamente.` });
        this.formSubmit.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al crear el proyecto', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el proyecto.' });
      }
    });
  }

  // Método para restablecer el formulario
  resetForm(): void {
    this.proyectoForm.reset();
    this.proyectoToEdit = null;
  }

  // Método para mostrar los errores en campos requeridos
  isFieldInvalid(field: string): boolean | undefined {
    return (
      this.proyectoForm.get(field)?.invalid &&
      (this.proyectoForm.get(field)?.dirty || this.proyectoForm.get(field)?.touched)
    );
  }
}
