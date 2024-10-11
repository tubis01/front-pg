import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoluntarioService } from '../../../voluntarios/services/voluntario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatosDetalleVoluntarioList } from '../../../voluntarios/interfaces/voluntario.interface';

@Component({
  selector: 'app-voluntario-form',
  templateUrl: './new-page-voluntario.component.html',
  styleUrl: './new-page-voluntario.component.css'
})
export class NewPageVoluntarioComponent implements OnInit {

  // Formulario para donadores
  public voluntarioForm: FormGroup = this.fb.group({
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
    private voluntarioService: VoluntarioService ,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService, // Servicio para mostrar notificaciones
    private confirmationService: ConfirmationService // Servicio para confirmación
  ) {}

  // Obtener los datos actuales del donador desde el formulario
  get currentDonador(): DatosDetalleVoluntarioList {
    return this.voluntarioForm.value as DatosDetalleVoluntarioList;
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.voluntarioService.getDonadorById(id).subscribe(donador => {
          if (donador) {
            this.voluntarioForm.patchValue(donador);
          } else {
            this.router.navigateByUrl('/donadores');
          }
        });
      }
    });
  }

  // Método para guardar o actualizar un donador
  onSubmit(): void {

      // Si no hay id, agregar un nuevo donador
      this.voluntarioService.addDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} creado!`);
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Error al crear donador', error);
        }
      );
  }

  // Método para mostrar notificaciones usando PrimeNG Toast
  showMessage(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }


}
