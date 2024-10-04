import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectServiceService } from '../../services/projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {
   // Recibe el proyecto para editar, si existe
   @Input() proyectoToEdit: Proyecto | null = null;
   // Evento para notificar al componente padre cuando se envía el formulario
   @Output() formSubmit = new EventEmitter<void>();

   public proyectoForm: FormGroup;

   constructor(
     private fb: FormBuilder,
     private proyectoService: ProjectServiceService,
   ) {
     // Inicializar el formulario con los campos requeridos
     this.proyectoForm = this.fb.group({
       id: [''],
       nombre: ['', Validators.required],
       descripcion: ['', Validators.required],
       fechaInicio: ['', Validators.required],
       fechaFin: ['', Validators.required],
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
       this.proyectoService.updateProyecto(this.proyectoForm.value).subscribe({
         next: () => {
           console.log('Proyecto actualizado exitosamente');
           this.formSubmit.emit();
           this.resetForm();
         },
         error: (err) => console.error('Error al actualizar el proyecto', err)
       });
     } else {
       this.proyectoService.registrarProyecto(this.proyectoForm.value).subscribe({
         next: () => {
           console.log('Proyecto creado exitosamente');
           this.formSubmit.emit();
           this.resetForm();
         },
         error: (err) => console.error('Error al crear el proyecto', err)
       });
     }
   }

   resetForm(): void {
     this.proyectoForm.reset();
     this.proyectoToEdit = null;
   }

}
