import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import {  ConfirmationService, MessageService } from 'primeng/api';
import { Responsable } from '../../interfaces/responsable.interface';
import { EncryptionService } from '../../../services/encryptData.service';

@Component({
  selector: 'app-new-responsable',
  templateUrl: './new-page.component.html',
  styleUrl: `./new-page.component.css`
})
export class NewPageComponent implements OnInit, OnChanges {


  // Lista de opciones de géneros
  public generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' }
  ];

  // Recibe el responsable para editar, si existe
  @Input() responsableToEdit: Responsable | null = null;
  // Evento para notificar al componente padre cuando se envía el formulario
  @Output() formSubmit = new EventEmitter<void>();

  public responsableForm: FormGroup;
  // private secretKey  = 'mysecretkey12345678901234567890'
  private secretKey  = 'myesbale123456789012345678901234'

  constructor(
    private fb: FormBuilder,
    private responsableService: ResponsableService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    // private encryptionService: EncryptionService
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
    // Si el formulario no es válido, mostrar mensajes de error y salir
    if (this.responsableForm.invalid) {
      // Mostrar errores específicos
      Object.keys(this.responsableForm.controls).forEach(field => {
        const control = this.responsableForm.get(field);
        if (control && control.invalid) {
          // Mostrar los errores de cada campo
          if (control.errors?.['required']) {
            this.messageService.add({ severity: 'warn', summary: 'Campo Requerido', detail: `El campo ${field} es obligatorio` });
          } else if (control.errors?.['pattern']) {
            this.messageService.add({ severity: 'warn', summary: 'Formato Incorrecto', detail: `El campo ${field} tiene un formato incorrecto` });
          } else if (control.errors?.['minlength'] || control.errors?.['maxlength']) {
            this.messageService.add({ severity: 'warn', summary: 'Longitud Incorrecta', detail: `El campo ${field} no tiene la longitud correcta` });
          }
        }
      });
      return;
    }


    // Si se está editando (existe id), mostrar el diálogo de confirmación para la actualización
    if (this.responsableToEdit?.id) {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que deseas actualizar a ${this.responsableForm.value.nombre} ${this.responsableForm.value.apellido}?`,
        header: 'Confirmar Actualización',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.updateResponsable(); // Actualizar el responsable
        },
        reject: () => {
          // Mostrar un mensaje cuando se cancele la operación
          this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La operación ha sido cancelada.' });
        }
      });
    } else {

      // Si es un registro nuevo, proceder sin confirmación
      // this.createResponsable();
      this.createResponsable();
    }
  }

  // Método para actualizar un responsable
  updateResponsable(): void {
    this.responsableService.updateResponsable(this.responsableForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualización Exitosa', detail: `El responsable ${this.responsableForm.value.nombre} ha sido actualizado correctamente.` });
        this.formSubmit.emit(); // Notificar al componente padre que el formulario ha sido enviado
        this.resetForm(); // Restablecer el formulario
      },
      error: (error) => {if (error.status === 404) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El DPI de la persona no existe para actualizar' });
    } else if (error.status === 409) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la persona' });
    }
      }
    });
  }

  isFieldInvalid(field: string): boolean | undefined {
    const control = this.responsableForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }


  // Método para crear un responsable
  createResponsable(): void {
    this.responsableService.addResponsable(this.responsableForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: `El responsable ${this.responsableForm.value.nombre} ha sido registrado correctamente.` });
        this.formSubmit.emit(); // Notificar al componente padre que el formulario ha sido enviado
        this.resetForm(); // Restablecer el formulario
      },
      error: (err) => {
        if(err.status === 409) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
        } else {
          console.error('Error al registrar el responsable', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el responsable.' });
        }
      }
    });
  }

  // Método para crear un responsable
  // createResponsable(encryptData: string): void {
  //   console.log("datos encriptados", encryptData);

  //   this.responsableService.addResponsable(encryptData).subscribe({
  //     next: () => {
  //       this.messageService.add({ severity: 'success', summary: 'Registro Exitoso', detail: `El responsable ${this.responsableForm.value.nombre} ha sido registrado correctamente.` });
  //       this.formSubmit.emit(); // Notificar al componente padre que el formulario ha sido enviado
  //       this.resetForm(); // Restablecer el formulario
  //     },
  //     error: (err) => {
  //       if(err.status === 409) {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
  //       } else {
  //         console.error('Error al registrar el responsable', err);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el responsable.' });
  //       }
  //     }
  //   });
  // }

  // Método para restablecer el formulario y limpiar la selección actual
  resetForm(): void {
    this.responsableForm.reset();
    this.responsableToEdit = null;
  }
}
