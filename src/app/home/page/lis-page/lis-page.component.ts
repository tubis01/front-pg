import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-lis-page',
  templateUrl: './lis-page.component.html',
  styleUrl: './lis-page.component.css'
})
export class LisPageComponent {

  // Estado para los diálogos
  showVoluntarioDialog = false;
  showDonadorDialog = false;

  // Imágenes para el carrusel
  imagenesCarrusel = [
    'assets/img/carrusel4.jpg',
    'assets/img/carrusel1.jpg',
    'assets/img/carrusel2.jpg',
    'assets/img/carrusel3.jpg',
  ];

  // Métodos para abrir los diálogos
  openVoluntarioForm(): void {
    this.showVoluntarioDialog = true;
  }

  openDonadorForm(): void {
    this.showDonadorDialog = true;
  }
}
