import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-tool-bar',
  templateUrl: './tool-bar.component.html',
  styles: ``
})
export class ToolBarComponent {


  @Input() enableSearch: boolean = false; // Habilitar o deshabilitar la búsqueda
  @Input() enableExcelExport: boolean = false; // Habilitar o deshabilitar exportación a Excel
  @Input() enablePdfExport: boolean = false; // Habilitar o deshabilitar exportación a PDF

  @Output() search = new EventEmitter<string>(); // Emitir el término de búsqueda
  @Output() export = new EventEmitter<string>(); // Emitir el tipo de exportación (excel/pdf)

  public searchTerm: string = '';

  onSearch(): void {
    this.search.emit(this.searchTerm); // Emitir el término de búsqueda
  }

  onExport(type: string): void {
    this.export.emit(type); // Emitir el tipo de exportación ('excel' o 'pdf')
  }

}
