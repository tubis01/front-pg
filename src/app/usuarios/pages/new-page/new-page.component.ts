import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Usuario } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../service/user.service';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent  implements OnInit, OnChanges {

  public isDisabled: boolean = false;
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
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar el formulario con los campos requeridos
    this.usuarioForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      rol: [[], Validators.required] // Se acepta un array de roles
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
      this.isDisabled = false; // Asegurarse de que el control esté habilitado
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    if (this.usuarioToEdit?.id) {
      this.usuarioService.actualizarUsuario(this.usuarioForm.value).subscribe({
        next: () => {
          console.log('Usuario actualizado con éxito');
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar el usuario', err)
      });
    } else {
      this.usuarioService.registrarUsuario(this.usuarioForm.value).subscribe({
        next: () => {
          console.log('Usuario registrado con éxito');
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => console.error('Error al registrar el usuario', err)
      });
    }
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.usuarioToEdit = null;
  }

}
