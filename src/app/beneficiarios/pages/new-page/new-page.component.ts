import { Proyecto } from './../../../proyectos/interfaces/proyecto.interface';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-new-beneficiario',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent {
  @Input() beneficiarioToEdit: Beneficiario | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public beneficiarioForm: FormGroup;
  public filteredProjects: Proyecto[] = [];  // Proyectos filtrados para autocompletar

  @Input() public allLoadedProjects: Proyecto[] = []; // Todos los proyectos cargados
  @Input() public nextPageUrl: string | null = null;  // Para cargar más proyectos


  // public isDigitador: boolean = false

  constructor(
    private fb: FormBuilder,
    private beneficiarioService: BeneficiarioService,
    private projectService: ProjectServiceService,
    private messageService: MessageService,
    private ConfirmationService: ConfirmationService,
  ) {
    this.beneficiarioForm = this.fb.group({
      id: [''],
      dpi: ['',
        [Validators.required,
          Validators.pattern('^[0-9]{13}$'), // Solo permite 13 dígitos numéricos
          Validators.minLength(13),
          Validators.maxLength(13)
        ]],
      proyecto: ['', Validators.required], // Aquí almacenamos el ID del proyecto
    });
  }

  ngOnInit(): void {
    this.allLoadedProjects = this.allLoadedProjects.map(proyecto => {
      return {
        ...proyecto,
        nombreCompleto: `${proyecto.id} ${proyecto.nombre} - ${proyecto.descripcion}` // Generamos el nombre completo
      };
    });
    if (this.beneficiarioToEdit) {
      this.beneficiarioForm.patchValue({
        id: this.beneficiarioToEdit.id,
        dpi: this.beneficiarioToEdit.DPI,
        proyecto: this.beneficiarioToEdit.idProyecto// Asignamos el ID del proyecto si existe
      });
    }

    // this.cargarProyectos(); // Cargar los proyectos al iniciar el componente
    // this.checkRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficiarioToEdit'] && changes['beneficiarioToEdit'].currentValue) {
      this.beneficiarioForm.patchValue({
        id: changes['beneficiarioToEdit'].currentValue.id,
        dpi: changes['beneficiarioToEdit'].currentValue.DPI,
        proyecto: changes['beneficiarioToEdit'].currentValue.proyecto?.id
      });
    }
  }

  onSubmit(): void {
    this.validarFormulario();

    if (this.beneficiarioToEdit?.id) {
      this.updateBeneficiario();
    } else {
      this.ConfirmationService.confirm({
        message: `¿Deseas registrar al beneficiario con DPI ${this.beneficiarioForm.value.dpi} al proyecto ${ this.selectedProyectoNombre}?`,
        header: 'Confirmar Registro',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.registerBeneficiario();
          console.log(this.beneficiarioForm.get('proyecto')?.value);

          this.resetForm();
          console.log(this.beneficiarioForm.get('proyecto')?.value);

        }
      });
    }
  }

  registerBeneficiario(): void {
    this.beneficiarioService.addBeneficiario(this.beneficiarioForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Beneficiario registrado exitosamente' });
        this.formSubmit.emit();
        this.resetForm();
      },
      error: (error) => {
        if (error.status === 404 || error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error});
      }
      console.error('Error al registrar el beneficiario', error);
      }
    });
  }

  updateBeneficiario(): void {

    this.beneficiarioService.updateBeneficiario(this.beneficiarioForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Beneficiario actualizado exitosamente' });
        this.formSubmit.emit();
        this.resetForm();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el beneficiario' });
        console.error('Error al actualizar el beneficiario', err);
      }
    });
  }

  validarFormulario(): void {
    if (this.beneficiarioForm.invalid) {
      this.beneficiarioForm.markAllAsTouched();
      Object.keys(this.beneficiarioForm.controls).forEach(field => {
        const control = this.beneficiarioForm.get(field);
        if (control?.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Campo Requerido', detail: `El campo ${field} es obligatorio.` });
        }
      });
      return;
    }
  }

  resetForm(): void {
    this.beneficiarioForm.reset(); // Resetea todos los campos del formulario
    this.beneficiarioForm.get('proyecto')?.setValue(null); // Limpiar el valor del campo autocompletar
    this.selectedProyectoNombre = ''; // Limpiar el nombre visualmente
    this.filteredProjects = []; // Limpiar las sugerencias

    // Limpiar manualmente el valor visual del autocompletar
    const autocomplete = document.querySelector('p-autoComplete input');
    if (autocomplete) {
      (autocomplete as HTMLInputElement).value = ''; // Limpiar el valor visible
    }
  }


  // Validar si un campo es inválido
  isFieldInvalid(field: string): boolean | undefined {
    return this.beneficiarioForm.get(field)?.invalid &&
      (this.beneficiarioForm.get(field)?.dirty || this.beneficiarioForm.get(field)?.touched);
  }


  // Método para cargar más proyectos
  cargarMasProyectos(): void {
    if (this.nextPageUrl) {
      this.projectService.getProyectoByUrl(this.nextPageUrl).subscribe((data) => {
        this.allLoadedProjects.push(
          ...data._embedded.datosDetalleProyectoList.map(proyecto => {
            return {
              ...proyecto,
              nombreCompleto: `${proyecto.id} ${proyecto.nombre} - ${proyecto.descripcion}`

            };
          })
        );

        // Actualizar la siguiente URL
        this.nextPageUrl = data._links.next?.href || null;
      });
    }
  }

  // Método para buscar proyectos en la lista cargada
  buscarProyectos(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();

    // Agregar el campo nombreCompleto a los proyectos antes de filtrarlos
    this.filteredProjects = this.allLoadedProjects.map(proyecto => {
      return {
        ...proyecto,
        nombreCompleto: `${proyecto.id} ${proyecto.nombre} - ${proyecto.descripcion}`
      };
    }).filter(proyecto => proyecto.nombreCompleto.toLowerCase().includes(query));
  }


  public selectedProyectoNombre = ''; // Nombre del proyecto seleccionado

  // Método para seleccionar un proyecto
  onProyectoSeleccionado(event: any): void {
    const selectedProyecto = event.id ? event : event.value; // Manejar ambos casos
    if (selectedProyecto && selectedProyecto.id) {
      // Establecer el ID del proyecto en el formulario
      this.beneficiarioForm.get('proyecto')?.setValue(selectedProyecto.id);
      // Mostrar el nombre completo en la interfaz
      this.selectedProyectoNombre = `${selectedProyecto.nombre} - ${selectedProyecto.descripcion}`;
    } else {
      console.error('El proyecto seleccionado no tiene un ID válido.');
    }
  }

}
