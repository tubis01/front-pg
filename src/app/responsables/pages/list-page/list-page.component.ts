import { Component } from '@angular/core';
import { Responsable } from '../../interfaces/responsable.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: `./list-page.component.css`
})
export class ListPageComponent {

  public selectedResponsable: Responsable | null = null;

  onEditResponsable(responsable: Responsable): void {
    this.selectedResponsable = responsable;
  }

  onFormSubmit(): void {
    this.selectedResponsable = null; // Reset after successful form submission
  }
}
