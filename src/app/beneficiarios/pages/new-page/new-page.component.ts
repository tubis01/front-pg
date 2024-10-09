import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { ProjectServiceService } from '../../../proyectos/services/projects.service';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';

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
  public allLoadedProjects: Proyecto[] = []; // Todos los proyectos cargados
  public nextPageUrl: string | null = null;  // Para cargar más proyectos

  public selectedProyectoNombre: string = '';  // Para mostrar el nombre en el autocompletado

  constructor(
    private fb: FormBuilder,
    private beneficiarioService: BeneficiarioService,
    private projectService: ProjectServiceService,
    private messageService: MessageService
  ) {
    this.beneficiarioForm = this.fb.group({
      dpi: ['', Validators.required],
      proyecto: ['', Validators.required], // Aquí almacenamos el ID del proyecto
    });
  }

  ngOnInit(): void {
    if (this.beneficiarioToEdit) {
      this.beneficiarioForm.patchValue({
        dpi: this.beneficiarioToEdit.DPI,
        proyecto: this.beneficiarioToEdit.idProyecto// Asignamos el ID del proyecto si existe
      });
    }
    this.cargarProyectos(); // Cargar los proyectos al iniciar el componente
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficiarioToEdit'] && changes['beneficiarioToEdit'].currentValue) {
      this.beneficiarioForm.patchValue({
        dpi: changes['beneficiarioToEdit'].currentValue.dpi,
        proyecto: changes['beneficiarioToEdit'].currentValue.proyecto?.id
      });
    }
  }

  onSubmit(): void {
    if (this.beneficiarioForm.invalid) {
      Object.keys(this.beneficiarioForm.controls).forEach(field => {
        const control = this.beneficiarioForm.get(field);
        if (control?.invalid) {
          this.messageService.add({ severity: 'warn', summary: 'Campo Requerido', detail: `El campo ${field} es obligatorio.` });
        }
      });
      return;
    }

    if (this.beneficiarioToEdit?.id) {
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
    } else {
      this.beneficiarioService.addBeneficiario(this.beneficiarioForm.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Beneficiario registrado exitosamente' });
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar el beneficiario' });
          console.error('Error al registrar el beneficiario', err);
        }
      });
    }
  }

  resetForm(): void {
    this.beneficiarioForm.reset();
    this.beneficiarioToEdit = null;
  }

  // Validar si un campo es inválido
  isFieldInvalid(field: string): boolean | undefined {
    return this.beneficiarioForm.get(field)?.invalid &&
      (this.beneficiarioForm.get(field)?.dirty || this.beneficiarioForm.get(field)?.touched);
  }

  // Método para cargar los proyectos iniciales
  cargarProyectos(): void {
    this.projectService.listarProyectos().subscribe(response => {
      this.allLoadedProjects = [
        ...this.allLoadedProjects, // Mantener los ya cargados
        ...response._embedded.datosDetalleProyectoList.map(proyecto => {
          return {
            ...proyecto,
            nombreCompleto: `${proyecto.id}. ${proyecto.nombre} - ${proyecto.descripcion}` // Crear un nombre completo
          };
        })
      ];
      // Si hay un siguiente enlace para cargar más proyectos, lo guardamos
      this.nextPageUrl = response._links.next?.href || null;
    });
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
    this.filteredProjects = this.allLoadedProjects.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(query)
    );
  }

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
