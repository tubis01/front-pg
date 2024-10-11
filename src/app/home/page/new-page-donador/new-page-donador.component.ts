import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonadoresService } from '../../../donadores/services/donadores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatosDetalleDonadorList } from '../../../donadores/interfaces/donador.interface';

@Component({
  selector: 'app-donador-form',
  templateUrl: './new-page-donador.component.html',
  styleUrl: './new-page-donador.component.css'
})
export class NewPageDonadorComponent implements OnInit {


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

      // Si no hay id, agregar un nuevo donador
      this.donadorService.addDonador(this.currentDonador).subscribe(
        donador => {
          this.showMessage(`Donador ${donador.nombre} creado!`);
          this.router.navigate(['/donadores']);
        },
        error => {
        }
      );

  }

  showMessage(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: message });
  }



}
