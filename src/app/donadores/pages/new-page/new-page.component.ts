import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosDetalleDonadorList, Genero } from '../../interfaces/donador.interface';
import { DonadoresService } from '../../services/donadores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {


  // Formulario para donadores
  public donadorForm: FormGroup = this.fb.group({
    id:              [''],
    nombre:          ['', Validators.required],   // Campo requerido
    apellido:        ['', Validators.required],   // Campo requerido
    genero:          ['', Validators.required],   // Campo requerido
    correo:           ['', [Validators.required, Validators.email]],  // Campo requerido con validación de email
    telefono:        ['', Validators.required],   // Campo requerido
    fechaNacimiento: ['', Validators.required],   // Campo requerido
    comentarios:      ['']
  });

  constructor(
    private fb: FormBuilder,
    private donadorService: DonadoresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, // Servicio para mostrar notificaciones
    private confirmationService: ConfirmationService // Servicio para confirmación
  ) {}

  // Obtener los datos actuales del donador desde el formulario
  get currentDonador(): DatosDetalleDonadorList {
    return this.donadorForm.value as DatosDetalleDonadorList;
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.donadorService.getDonadorById(id).subscribe(donador => {
          if (donador) {
            this.donadorForm.patchValue(donador);
          } else {
            this.router.navigateByUrl('/donadores');
          }
        });
      }
    });
  }

  // Método para guardar o actualizar un donador
  onSubmit(): void {
    if (this.donadorForm.invalid) return;

    if (this.currentDonador.id) {
      // Si hay un id, actualizar el donador
      this.donadorService.putDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} actualizado!`);
          this.router.navigate(['/donadores']);
        },
        error => {
          this.handleError(error, 'actualizar');
        }
      );
    } else {
      // Si no hay id, agregar un nuevo donador
      this.donadorService.addDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} creado!`);
          this.router.navigate(['/donadores']);
        },
        error => {
          this.handleError(error, 'crear');
        }
      );
    }
  }

  private handleError(error: any, action: string): void {
    if (error.status === 500 && error.error.includes('duplicate key value violates unique constraint')) {
      this.showMessage(`Error: El teléfono ya está registrado. No se puede ${action} el donador.`);
    } else {
      console.error(`Error al ${action} donador`, error);
      this.showMessage(`Error inesperado al ${action} el donador.`);
    }
  }
  // Método para mostrar notificaciones usando PrimeNG Toast
  showMessage(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }

  // Método para eliminar un donador con confirmación
  onDeleteDonador(): void {
    if (!this.currentDonador.id) return;

    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este donador?',
      accept: () => {
        this.donadorService.deleteDonador(this.currentDonador.id).subscribe(() => {
          this.showMessage('Donador eliminado exitosamente');
          this.router.navigate(['/donadores']);
        });
      }
    });
  }
// Mostrar notificación



}
