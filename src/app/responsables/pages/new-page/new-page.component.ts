import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { Responsable } from '../../interfaces/responsable.interface';

@Component({
  selector: 'app-new-responsable',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit, OnChanges {

  public generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' }
  ];

 // Recibe el responsable para editar, si existe
 @Input() responsableToEdit: Responsable | null = null;
 // Evento para notificar al componente padre cuando se envía el formulario
 @Output() formSubmit = new EventEmitter<void>();

 public responsableForm: FormGroup;

 constructor(
   private fb: FormBuilder,
   private responsableService: ResponsableService,
   private router: Router
 ) {
   // Inicializar el formulario con los campos requeridos
   this.responsableForm = this.fb.group({
     id: [''],
     nombre: ['', Validators.required],
     apellido: ['', Validators.required],
     genero: ['', Validators.required],
     correo: ['', [Validators.required, Validators.email]],
     telefono: ['', Validators.required],
     fechaNacimiento: ['', Validators.required],
   });
 }

 ngOnInit(): void {
   // Si se pasa un responsable para editar al inicializar el componente, actualizar el formulario con sus valores
   if (this.responsableToEdit) {
     this.responsableForm.patchValue(this.responsableToEdit);
   }
 }

 // Detecta los cambios en el `@Input()` responsableToEdit para actualizar el formulario cuando cambia
 ngOnChanges(changes: SimpleChanges): void {
   if (changes['responsableToEdit'] && changes['responsableToEdit'].currentValue) {
     // Actualizar el formulario con los datos del responsable a editar
     this.responsableForm.patchValue(changes['responsableToEdit'].currentValue);
   }
 }

 // Método para manejar el envío del formulario
 onSubmit(): void {
   // Si el formulario no es válido, salir
   if (this.responsableForm.invalid) return;

   // Determinar si se está editando o creando un responsable
   if (this.responsableToEdit?.id) {
     // Si existe `id`, estamos en modo de edición
     this.responsableService.updateResponsable(this.responsableForm.value).subscribe({
       next: () => {
         console.log('Responsable actualizado exitosamente');
         this.formSubmit.emit(); // Notificar al componente padre
         this.resetForm(); // Restablecer el formulario después de actualizar
       },
       error: (err) => console.error('Error al actualizar el responsable', err)
     });
   } else {
     // Si no existe `id`, estamos en modo de creación
     this.responsableService.addResponsable(this.responsableForm.value).subscribe({
       next: () => {
         console.log('Responsable creado exitosamente');// Redirigir a la lista de responsables
         this.formSubmit.emit(); // Notificar al componente padre
         this.resetForm(); // Restablecer el formulario después de registrar
       },
       error: (err) => console.error('Error al crear el responsable', err)
     });
   }
 }

 // Método para restablecer el formulario y limpiar la selección actual
 resetForm(): void {
   this.responsableForm.reset();
   this.responsableToEdit = null;
 }

}
