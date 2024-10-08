import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { PersonService } from '../../services/persons.service';
import { DIRECCIONES } from '../../interfaces/direcciones';
import { Persona } from '../../interfaces/persona.interface';
import { MessageService } from 'primeng/api';
import { HateoasResponse, Responsable } from '../../../responsables/interfaces/responsable.interface';
import { ResponsableService } from '../../../responsables/services/responsable.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';


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

  public responsables : Responsable[] = [];
  public filteredResponsables: Responsable[] = [];

  public nextPageUrl: string | null = null;

  public selectedResponsable: string = '';
  public originalResponsableId: number | null = null;

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
    private responsableService : ResponsableService
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

    this.cargarResponsables();
    // Esta parte se ejecuta una sola vez cuando el componente es inicializado
    if (this.personToEdit) {
      this.isEditMode = true;
      this.personaForm.patchValue(this.personToEdit);
    }

}

cargarResponsables(): void {
  this.responsableService.getResponsable().subscribe(response => {
    // Concatenar los responsables previamente cargados con los nuevos
    this.responsables = [
      ...this.responsables, // Mantiene los ya cargados
      ...response._embedded.datosDetalleResponsableList.map(responsable => {
        return {
          ...responsable,
          nombreCompleto:  `${responsable.id}. ${responsable.nombre} ${responsable.apellido}` // Asegura que `nombreCompleto` exista
        };
      })
    ];
    // Si hay un siguiente enlace para cargar más, lo guardamos
    this.nextPageUrl = response._links.next?.href || null;
  });
}

// Método para cargar más responsables
cargarMasResponsables(): void {
  if (this.nextPageUrl) {
    this.responsableService.getResponsableByUrl(this.nextPageUrl).subscribe((data: HateoasResponse<Responsable>) => {
      // Concatenar los nuevos responsables a los que ya tienes
      this.responsables.push(...data._embedded.datosDetalleResponsableList.map(responsable => {
        return {
          ...responsable,
          nombreCompleto: `${responsable.id} ${responsable.nombre} ${responsable.apellido}` // Asegura que `nombreCompleto` exista
        };
      }));
      // Actualizar el nextPageUrl para la siguiente carga, si existe
      this.nextPageUrl = data._links.next?.href || null;
    });
  }
}

// Método para buscar responsables en la lista completa de responsables cargados
buscarResponsables(event: AutoCompleteCompleteEvent): void {
  const query = event.query.toLowerCase();
  this.filteredResponsables = this.responsables.filter(responsable =>
    responsable.nombre.toLowerCase().includes(query)
  );
}


    public selectedResponsableNombre: string = ''; // Variable para mostrar el nombre en el autocompletado

    onResponsableSeleccionado(event: any) {
      const selectedResponsable = event.id ? event : event.value; // Manejar ambos casos (en caso de que `event.value` esté presente)
      if (selectedResponsable && selectedResponsable.id) {
        // Establecer el ID del responsable en el formulario
        this.personaForm.get('responsable')?.setValue(selectedResponsable.id);

        // Mostrar el nombre completo en la interfaz
        this.selectedResponsableNombre = `${selectedResponsable.nombre} ${selectedResponsable.apellido}`;
        console.log('Responsable seleccionado con ID:', selectedResponsable.id); // Depuración
      } else {
        console.error('El responsable seleccionado no tiene un ID válido.');
      }
    }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cambios en la propiedad de entrada personToEdit
    if (changes['personToEdit'] && changes['personToEdit'].currentValue) {
      this.isEditMode = true;

// Parchar los valores excepto el responsable
    const { idResponsable, responsable, ...restOfPerson } = changes['personToEdit'].currentValue;
    
    this.personaForm.patchValue(restOfPerson);

    // Asigna el idResponsable al campo responsable del formulario
    this.personaForm.get('responsable')?.setValue(idResponsable);

    // Almacenar el id original para comparar si se modifica
    this.originalResponsableId = idResponsable;

    // Establecer el nombre del responsable visible
    this.selectedResponsableNombre = responsable || '';
      // this.originalResponsableId = responsable ? responsable : null;
      this.cd.detectChanges();
    } else {
      this.isEditMode = false;
      this.personaForm.reset();
    }
  }

  buscarUbicaciones(event: AutoCompleteCompleteEvent): void {
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

    const formData = { ...this.personaForm.value };

    if (this.isEditMode) {

      const currentResposbleId = this.personaForm.get('responsable')?.value;

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
