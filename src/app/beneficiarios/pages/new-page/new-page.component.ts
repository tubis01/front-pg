import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiarioService } from '../../services/beneficiario.service';

@Component({
  selector: 'app-new-beneficiario',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {
  @Input() beneficiarioToEdit: Beneficiario | null = null;
  @Output() formSubmit = new EventEmitter<void>();

  public beneficiarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private beneficiarioService: BeneficiarioService
  ) {
    this.beneficiarioForm = this.fb.group({
      dpi: ['', Validators.required],
      proyecto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.beneficiarioToEdit) {
      this.beneficiarioForm.patchValue(this.beneficiarioToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficiarioToEdit'] && changes['beneficiarioToEdit'].currentValue) {
      this.beneficiarioForm.patchValue(changes['beneficiarioToEdit'].currentValue);
    }
  }

  onSubmit(): void {
    if (this.beneficiarioForm.invalid) return;

    if (this.beneficiarioToEdit?.id) {
      this.beneficiarioService.updateBeneficiario(this.beneficiarioForm.value).subscribe({
        next: () => {
          console.log('Beneficiario actualizado exitosamente');
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar el beneficiario', err)
      });
    } else {
      this.beneficiarioService.addBeneficiario(this.beneficiarioForm.value).subscribe({
        next: () => {
          console.log('Beneficiario creado exitosamente');
          this.formSubmit.emit();
          this.resetForm();
        },
        error: (err) => console.error('Error al crear el beneficiario', err)
      });
    }
  }

  resetForm(): void {
    this.beneficiarioForm.reset();
    this.beneficiarioToEdit = null;
  }

}
