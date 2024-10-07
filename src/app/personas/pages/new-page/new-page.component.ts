import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { PersonService } from '../../services/persons.service';
import { DIRECCIONES } from '../../interfaces/direcciones';
import { Persona } from '../../interfaces/persona.interface';


@Component({
  selector: 'person-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: `./new-page.component.css`
})
export class NewPageComponent implements OnInit, OnChanges {

  @Input() personToEdit: Persona | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public personaForm: FormGroup;
  public direcciones = DIRECCIONES;



  public isEditMode  = false;

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
    private router: Router,
    private personaService: PersonService,
    private cd: ChangeDetectorRef
  ) {
    this.personaForm = this.fb.group({
      DPI: ['', Validators.required],
      NIT: ['', Validators.required],
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
      vendeExcedenteCosecha: [false, Validators.required],
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

  onSubmit(): void {
    if (this.personaForm.invalid) {
      console.log('Formulario no válido');
      return;
    }

if (this.isEditMode) {
      // Actualizar persona
      this.personaService.updatePerson( this.personaForm.value).subscribe({
        next: () => {
          console.log('Persona actualizada con éxito');
          this.formSubmit.emit();
          this.isEditMode = false;
          this.personaForm.reset();
        }
      });
    } else {
      // Registrar nueva persona
      this.personaService.registrarPersona(this.personaForm.value).subscribe({
        next: () => {
          console.log('Persona registrada con éxito');
          this.formSubmit.emit();
          this.personaForm.reset();
        }
      });
    }
  }
}
