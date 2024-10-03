import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { DatosDetalleResponsableList } from '../../interfaces/responsable.interface';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {


  // Formulario para donadores
  public responsableForm: FormGroup = this.fb.group({
    id:              [''],
    nombre:          ['', Validators.required],   // Campo requerido
    apellido:        ['', Validators.required],   // Campo requerido
    genero:          ['', Validators.required],   // Campo requerido
    correo:           ['', [Validators.required, Validators.email]],  // Campo requerido con validación de email
    telefono:        ['', Validators.required],   // Campo requerido
    fechaNacimiento: ['', Validators.required],   // Campo requerido
  });

  constructor(
    private fb: FormBuilder,
    private responsableService: ResponsableService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, // Servicio para mostrar notificaciones
    private confirmationService: ConfirmationService // Servicio para confirmación
  ) {}

  // Obtener los datos actuales del donador desde el formulario
  get currentDonador(): DatosDetalleResponsableList {
    return this.responsableForm.value as DatosDetalleResponsableList;
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.responsableService.getDonadorById(id).subscribe(donador => {
          if (donador) {
            this.responsableForm.patchValue(donador);
          } else {
            this.router.navigateByUrl('/donadores');
          }
        });
      }
    });
  }

  // Método para guardar o actualizar un donador
  onSubmit(): void {
    if (this.responsableForm.invalid) return;

    if (this.currentDonador.id) {
      // Si hay un id, actualizar el donador
      this.responsableService.putDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} actualizado!`);
          this.router.navigate(['/donadores']);
        },
        error => {
          console.error('Error al actualizar donador', error);
        }
      );
    } else {
      // Si no hay id, agregar un nuevo donador
      this.responsableService.addDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} creado!`);
          this.router.navigate(['/donadores']);
        },
        error => {
          console.error('Error al crear donador', error);
        }
      );
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
        this.responsableService.deleteDonador(this.currentDonador.id).subscribe(() => {
          this.showMessage('Donador eliminado exitosamente');
          this.router.navigate(['/donadores']);
        });
      }
    });
  }

}
