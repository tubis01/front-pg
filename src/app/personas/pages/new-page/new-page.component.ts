import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../services/persons.service';
import { DIRECCIONES } from '../../interfaces/direcciones';
import { Persona } from '../../interfaces/persona.interface';
import { MessageService } from 'primeng/api';
import { HateoasResponse, Responsable } from '../../../responsables/interfaces/responsable.interface';
import { ResponsableService } from '../../../responsables/services/responsable.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CacheService } from '../../../dashboard/services/cache.service';


@Component({
  selector: 'person-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: `./new-page.component.css`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPageComponent implements OnInit, OnChanges {

  @Input() personToEdit: Persona | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public personaForm: FormGroup;
  // public isEditMode  = false;

  public direcciones = DIRECCIONES;
  public filteredUbicaciones: any[] = [];

  public responsables : Responsable[] = [];
  public filteredResponsables: Responsable[] = [];

  public nextPageUrl: string | null = null;

  // public selectedResponsable: string = '';
  public originalResponsableId: number | null = null;

  public generos = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' }
  ];

  public tiposProductor = [
    { label: 'Excedencia', value: 'EXCEDENCIA' },
    { label: 'Susbsistencia', value: 'SUBSISTENCIA' },
    { label: 'Infrasubsistencia', value: 'INFRASUBSISTENCIA' },
    { label: 'Comercial-comercial', value: 'SEMI_COMERCIAL' },
    { label: 'Exportador', value: 'EXPORTADOR' }
  ];

  public organizaciones = [
    {label: 'Adics', value: 1},
    {label: 'Unac', value: 2},
    {label: 'Redcodezca', value: 3},

  ]



  constructor(
    private fb: FormBuilder,
    private personaService: PersonService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private responsableService : ResponsableService,
    private cacheService: CacheService
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
      NIT: ['',
        [Validators.pattern('^[0-9]{9}$'),
          Validators.minLength(9),
          Validators.maxLength(9)
        ]], // Validar que sea un número de 9 dígitos
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      tercerNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      apellidoCasada: [''],
      telefono: ['',
        [Validators.required,
          Validators.pattern('^[0-9]{8}$'), // Solo permite 8 dígitos numéricos
          Validators.minLength(8),
          Validators.maxLength(8)
        ]],
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


    ngOnChanges(changes: SimpleChanges): void {
      // Detectar cambios en la propiedad de entrada personToEdit
      if (changes['personToEdit'] && changes['personToEdit'].currentValue) {

        const { idResponsable, responsable, organizacionId, ...restOfPerson } = changes['personToEdit'].currentValue;

        this.personaForm.patchValue({
          ...restOfPerson,
          organizacion: organizacionId, // Asigna el ID de la organización al campo del formulario
        });

        // Asigna el idResponsable al campo responsable del formulario
        this.personaForm.get('responsable')?.setValue(idResponsable);

        // Almacenar el id original para comparar si se modifica
        this.originalResponsableId = idResponsable;

        // Establecer el nombre del responsable visible
        this.selectedResponsableNombre = responsable || '';

        // this.cd.markForCheck();
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
    } else {
    }
  }



  onSubmit(): void {
    if(!this.personToEdit){


    }

    this.validarFormulario();

    if (this.personaForm.invalid) {
      return;
    }

    if (this.personToEdit?.DPI) {

      this.modificarPersona();
    } else {
      this.registrarPersona();
      this.resetForm();
    }
  }

  modificarPersona(): void {
    this.personaService.updatePerson(this.personaForm.value).subscribe({
      next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona actualizada con éxito' });
          this.formSubmit.emit();
          // this.isEditMode = false;
          this.cacheService.delete('personas_listar')
          this.resetForm();


      },
      error: (error) => {
          // Aquí manejas los errores específicos que devuelve el backend
          if (error.status === 404) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El DPI de la persona no existe para actualizar' });
          } else if (error.status === 409) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
          } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
          }
      }
  });
}


  registrarPersona(): void {
          // Registrar nueva persona
          this.personaService.registrarPersona(this.personaForm.value).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Persona registrada con éxito' });
              this.formSubmit.emit();
              this.resetForm();

            },
            error: (error) => {
              if (error.status === 409) {
                this.messageService.add({ severity: 'error', summary: 'Error de Duplicación', detail: error.error });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la persona' });
              }
            }
          });
        }

  validarFormulario(): void {
    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();  // Esto solo se ejecuta si el formulario está siendo enviado
      // Mostrar mensajes de alerta para los campos que no cumplen con los validadores
      Object.keys(this.personaForm.controls).forEach(field => {
        const control = this.personaForm.get(field);
        if (control?.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Campo Requerido', detail: `El campo ${field} es obligatorio.` });
        }
      });
      return; // Salir si el formulario es inválido
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



// Método para cargar más responsables
cargarMasResponsables(): void {

  if (this.nextPageUrl) {
    this.responsableService.getResponsableByUrl(this.nextPageUrl).subscribe((data: HateoasResponse<Responsable>) => {
      // Concatenar los nuevos responsables a los que ya tienes sin afectar la validación
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

public selectedResponsableNombre = ''; // Variable para mostrar el nombre en el autocompletado


  onResponsableSeleccionado(event: any) {
    const selectedResponsable = event.id ? event : event.value; // Manejar ambos casos (en caso de que `event.value` esté presente)
    if (selectedResponsable && selectedResponsable.id) {
      // Establecer el ID del responsable en el formulario
      this.personaForm.get('responsable')?.setValue(selectedResponsable.id);

      // Mostrar el nombre completo en la interfaz
      this.selectedResponsableNombre = selectedResponsable.nombreCompleto;
    }
  }


  resetForm(): void {
    this.personaForm.reset(); // Resetea todos los campos del formulario
    this.personaForm.get('responsable')?.setValue(null);
    this.selectedResponsableNombre = ''; // Limpiar el nombre visualmente
    this.filteredResponsables = []; // Limpiar las sugerencias

    // Limpieza manual del valor visible en el autocompletar de "responsable"
    const autocomplete = document.querySelector('p-autoComplete input');
    if (autocomplete) {
      (autocomplete as HTMLInputElement).value = ''; // Limpiar el valor visible
    }
  }

}
