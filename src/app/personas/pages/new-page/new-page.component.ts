import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { PersonService } from '../../services/persons.service';
import { DIRECCIONES } from '../../interfaces/direcciones';
import moment from 'moment';


@Component({
  selector: 'person-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: `./new-page.component.css`
})
export class NewPageComponent implements OnInit {

  public personaForm: FormGroup;
  public direcciones = DIRECCIONES;

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
    private personaService: PersonService
  ) {
    this.personaForm = this.fb.group({
      dpi: ['', Validators.required],
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
      vendeExecedenteCosecha: [false, Validators.required],
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
        dicapacidadIntelectual: [false], // Checkbox para discapacidad intelectual
        discapacidadMotora: [false] // Checkbox para discapacidad motora
      })
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.personaForm.invalid) {
      console.log('Formulario no válido');
      return;
    }

    console.log('Formulario válido', this.personaForm.value);


    this.personaService.registrarPersona(this.personaForm.value).subscribe(
      (response) => {
        console.log('Persona registrada con éxito', response);
        this.router.navigate(['/person']);
      },
      (error) => {
        console.error('Error al registrar persona', error);
      }
    );
  }

}
