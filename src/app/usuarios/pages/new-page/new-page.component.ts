import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Usuario } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent  implements OnInit, OnChanges {

  public roles = [
    { label: 'ADMIN', value: 'admin' },
    { label: 'USER', value: 'user' }
  ];

  @Input() usuarioToEdit: Usuario | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    // Inicializar el formulario con los campos requeridos
    this.usuarioForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]], // Campo para confirmar el email
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      rol: ['', Validators.required] // Se acepta solo un rol
    }, {
      validators: this.emailsMatchValidator // Validador personalizado para comparar los correos
    });
  }

  ngOnInit(): void {
    if (this.usuarioToEdit) {
      this.usuarioForm.patchValue(this.usuarioToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioToEdit'] && changes['usuarioToEdit'].currentValue) {
      this.usuarioForm.patchValue(changes['usuarioToEdit'].currentValue);
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const formValue = {
      ...this.usuarioForm.value,
      rol: [this.usuarioForm.value.rol] // Convertir el rol a un array con un solo valor, como lo espera el backend
    };

    if (this.usuarioToEdit?.id) {
      this.usuarioService.actualizarUsuario(formValue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado con éxito' });
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => {
          if (err.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no encontrado (404)' });
          } else if (err.status === 409) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Conflicto: el usuario ya existe (409)' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario' });
          }
          console.error('Error al actualizar el usuario', err);
        }
      });
    } else {
      this.usuarioService.registrarUsuario(formValue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado con éxito' });
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => {
          if (err.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error});
          } else if (err.status === 409) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error});
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar el usuario' });
          }
          console.error('Error al registrar el usuario', err);
        }
      });
    }
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.usuarioToEdit = null;
  }

  // Validador personalizado para comprobar que los correos coincidan
  emailsMatchValidator(formGroup: FormGroup): null | { emailsNotMatching: boolean } {
    const email = formGroup.get('email')?.value;
    const confirmEmail = formGroup.get('confirmEmail')?.value;
    return email && confirmEmail && email !== confirmEmail ? { emailsNotMatching: true } : null;
  }

  // Verifica si los campos de correo coinciden
  emailsMatch(): boolean {
    return this.usuarioForm.get('email')?.value === this.usuarioForm.get('confirmEmail')?.value;
  }

  isFieldInvalid(field: string): boolean | undefined {
    const control = this.usuarioForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
