import { Component } from '@angular/core';
import { Beneficiario } from '../../interfaces/beneficiario.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {
  public selectedBeneficiario: Beneficiario | null = null;

  onEditBeneficiario(beneficiario: Beneficiario): void {
    // Al hacer clic en editar, se asigna el beneficiario para editar al formulario
    this.selectedBeneficiario = beneficiario;
  }

  onFormSubmit(): void {
    // Se resetea el formulario después de enviarlo correctamente
    this.selectedBeneficiario = null;
  }

}
