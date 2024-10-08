import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { PersonService } from '../../services/persons.service';
import { DIRECCIONES } from '../../interfaces/direcciones';
import { Persona } from '../../interfaces/persona.interface';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'person-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: `./new-page.component.css`
})
export class NewPageComponent implements OnInit, OnChanges {

  @Input() personToEdit: Persona | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public personaForm: FormGroup;
  public isEditMode  = false;

  public direcciones = DIRECCIONES;
  public filteredUbicaciones: any[] = [];

  public generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' }
  ];

  public tiposProductor = [
    { label: 'Excedencia', value: 'EXCEDENCIA' },
    { label: 'Susbsistencia', value: 'SUSBSISTENCIA' },
    { label: 'Infrasubsistencia', value: 'INFRASUBSISTENCIA' }
  ];

  public organizaciones = [
    {label: 'Adics', value: 'ADICS'},
    {label: 'Unac', value: 'UNAC'},
    {label: 'Redcodezca', value: 'REDCODEZCA'},

  ]



  constructor(
    private fb: FormBuilder,
    private personaService: PersonService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
  ) {
    this.personaForm = this.fb.group({
      DPI: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]{13}$'), // Solo permite 13 dígitos numéricos
          Validators.minLength(13),
          Validators.maxLength(13)

        ]
      ], // Validar que sea un número de 13 dígitos
      NIT: [''],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      tercerNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      etnia: ['', Validators.required],
      genero: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      numeroHijos: [0, Validators.required], // Inicializar como 0 en lugar de vacío
      comunidadLinguistica: ['', Validators.required],
      area: ['', Validators.required],
      cultivo: ['', Validators.required],
      vendeExcedenteCosecha: [false],
      tipoProductor: ['', Validators.required],
      responsable: ['', Validators.required],
      organizacion: ['', Validators.required],
      tipoVivienda: ['', Validators.required],
      direccion: this.fb.group({
        codigo: ['', Validators.required],
        comunidad: ['', Validators.required]
      }),
      discapacidad: this.fb.group({
        discapacidadAuditiva: [false], // Checkbox para discapacidad auditiva
        discapacidadIntelectual: [false], // Checkbox para discapacidad intelectual
        discapacidadMotora: [false] // Checkbox para discapacidad motora
      })
    });
  }

  ngOnInit(): void {
    // Esta parte se ejecuta una sola vez cuando el componente es inicializado
    if (this.personToEdit) {
      this.isEditMode = true;
      this.personaForm.patchValue(this.personToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en la propiedad de entrada personToEdit
    if (changes['personToEdit'] && changes['personToEdit'].currentValue) {
      this.isEditMode = true;
      this.personaForm.patchValue(this.personToEdit!);
      this.cd.detectChanges();
    } else {
      this.isEditMode = false;
      this.personaForm.reset();
    }
  }

  buscarUbicaciones(event: any) {
    const query = event.query.toLowerCase();
    this.filteredUbicaciones = this.direcciones.filter(ubicacion =>
      ubicacion.nombreCompleto.toLowerCase().includes(query)
    );
  }

  // Asigna el código de la ubicación seleccionada al formulario
  onUbicacionSeleccionada(event: any) {
    // Acceder al valor dentro de "event.value"
    if (event && event.value && event.value.codigo) {
      this.personaForm.get('direccion.codigo')?.setValue(event.value.codigo);
      console.log('Código asignado:', event.value.codigo); // Verifica que se asigna correctamente el código como string
    } else {
      console.error('No se asignó código, evento no contiene "codigo".');
    }
  }




  seleccionarUbicacion(event: any) {
    this.personaForm.get('direccion')?.get('codigo')?.setValue(event.codigo);
  }



  isFieldInvalid(field: string): boolean | undefined {
    return (
      this.personaForm.get(field)?.invalid &&
      (this.personaForm.get(field)?.dirty || this.personaForm.get(field)?.touched)
    );
  }


  isFieldInvalidD(groupName: string, fieldName: string): boolean | undefined {
    const field = this.personaForm.get(`${groupName}.${fieldName}`);
    return field?.invalid && (field?.dirty || field?.touched);
  }


  onSubmit(): void {

    console.log('Formulario a enviar:', this.personaForm.value);
    if (this.personaForm.invalid) {
      // Mostrar errores específicos
      Object.keys(this.personaForm.controls).forEach(field => {
        const control = this.personaForm.get(field);
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
    

    if (this.isEditMode) {
      this.personaService.updatePerson(this.personaForm.value).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona actualizada con éxito' });
              this.formSubmit.emit();
              this.isEditMode = false;
              this.personaForm.reset();
          },
          error: (error) => {
              // Aquí manejas los errores específicos que devuelve el backend
              if (error.status === 404) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El DPI de la persona no existe para actualizar' });
              } else if (error.status === 409) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
              } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la persona' });
              }
          }
      });
    } else {
      // Registrar nueva persona
      this.personaService.registrarPersona(this.personaForm.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona registrada con éxito' });
          console.log('Persona registrada con éxito');
          this.formSubmit.emit();
          this.personaForm.reset();
        },
        error: (error) => {
          if (error.status === 409) {
            this.messageService.add({ severity: 'error', summary: 'Error de Duplicación', detail: error.error });
          } else {
            console.error('Error registering person', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la persona' });
          }
        }
      });
    }
  }

}
