import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Beneficiario, HateoasResponse, Links } from '../../interfaces/beneficiario.interface';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ExportService } from '../../services/export.service';
import { ExporDialogComponent } from '../expor-dialog/expor-dialog.component';
import { Proyecto } from '../../../proyectos/interfaces/proyecto.interface';
import { catchError, of, tap } from 'rxjs';
@Component({
  selector: 'app-beneficiario-table',
  templateUrl: './beneficiario-table.component.html',
  styleUrl: './beneficiario-table.component.css'
})
export class BeneficiarioTableComponent {
  public beneficiarios: Beneficiario[] = [];
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;
  public links: Links | undefined;

  public beneficiarioSearch: Beneficiario[] = [];
  public isLoading: boolean = false;

  public searchTerm: string = '';

  @Input() proyectos: Proyecto[] = [];


  @Output() editBeneficiario = new EventEmitter<Beneficiario>();


  constructor(
    private beneficiarioService: BeneficiarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private exporService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiarios(this.currentPage);
  }

  loadBeneficiarios(page: number): void {
    this.isLoading = true; // Iniciar la carga
    this.beneficiarioService.getBeneficiarios(page, this.pageSize)
      .pipe(
        tap((response: HateoasResponse<Beneficiario>) => {
          if (response._embedded && response._embedded.datosDetalleBeneficiarioList) {
            this.beneficiarios = response._embedded.datosDetalleBeneficiarioList;
          }
          this.links = response._links;
          this.currentPage = response.page.number;
          this.totalPages = response.page.totalPages;
          this.totalElements = response.page.totalElements;
          this.isLoading = false; // Finalizar la carga
        }),
        catchError((error) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los beneficiarios.' });
          console.error('Error fetching beneficiarios', error);
          return of(); // Devolver un observable vacío para continuar con el flujo
        })
      )
      .subscribe();
  }
    // Método para editar un beneficiario
    onEdit(beneficiario: Beneficiario): void {
      console.log('Editando beneficiario', beneficiario);

      this.confirmationService.confirm({
      message: `¿Deseas editar al beneficiario Dpi:${beneficiario.DPI} Proyecto:${beneficiario.NombreProyecto}?`,
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editBeneficiario.emit(beneficiario);
        this.messageService.add({ severity: 'success', summary: 'Operación Exitosa', detail: `Edición del beneficiario ${beneficiario.DPI} iniciada.` });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: `Edición del beneficiario ${beneficiario.DPI} cancelada.` });
      }
      });
    }

    // Confirmar antes de eliminar un beneficiario
    confirmDelete(beneficiario: Beneficiario): void {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que deseas eliminar al beneficiario con DPI ${beneficiario.DPI}?`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.beneficiarioService.deleteBeneficiario(beneficiario.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Beneficiario eliminado correctamente' });
              this.loadBeneficiarios(this.currentPage);
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el beneficiario.' });
              console.error('Error al eliminar beneficiario', err);
            }
          });
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'La eliminación fue cancelada.' });
        }
      });
    }

    onSearch(term: string): void {
      this.isLoading = true;

      if (term && term.trim().length > 0) {
        this.beneficiarioService.buscarPorDpiParcial(term, this.currentPage, this.pageSize)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.beneficiarios = data; // Mostrar los beneficiarios filtrados
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error al buscar beneficiarios por DPI parcial:', err);
          }
        });
      } else {
        // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
        this.loadBeneficiarios(this.currentPage);
        this.isLoading = false;
      }
    }


    openExportDialog(): void {
      const ref = this.dialogService.open(ExporDialogComponent, {
        header: 'Exportar Beneficiarios',
        data: {
          proyectos: this.proyectos  // Pasamos los proyectos al diálogo
        }
      });

      ref.onClose.subscribe((exportData) => {
        console.log("Diálogo cerrado, datos de exportación:", exportData);
        if (exportData) {
          this.exportToExcel(exportData.idProyecto, exportData.activo);
        }
      });

      console.log('Diálogo de exportación abierto');
    }

    exportToExcel(idProyecto: number, activo: boolean): void {
      console.log('Exportando beneficiarios:', idProyecto, activo);

      this.exporService.exportBeneficiarios(idProyecto, activo).subscribe({
        next: (response) => {
          // Crear un Blob con la respuesta del backend
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Crear una URL temporal para el archivo y disparar la descarga
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;

          // Nombrar el archivo de salida
          a.download = `beneficiarios_proyecto_${idProyecto}.xlsx`;
          document.body.appendChild(a);
          a.click();

          // Eliminar el objeto URL creado
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al exportar beneficiarios', err);
        }
      });
    }





  // Maneja el cambio de página
  onPageChange(event: any): void {
    const page = event.page;
    this.loadBeneficiarios(page);
  }

  // Métodos para la paginación con enlaces HATEOAS
  loadFirstPage(): void {
    if (this.links?.first) {
      this.loadFromLink(this.links.first.href);
    }
  }

  loadLastPage(): void {
    if (this.links?.last) {
      this.loadFromLink(this.links.last.href);
    }
  }

  loadNextPage(): void {
    if (this.links?.next) {
      this.loadFromLink(this.links.next.href);
    }
  }

  loadPrevPage(): void {
    if (this.links?.prev) {
      this.loadFromLink(this.links.prev.href);
    }
  }

  loadFromLink(url: string): void {
    this.beneficiarioService.getBeneficiarioByUrl(url).subscribe({
      next: (response: HateoasResponse<Beneficiario>) => {
        if (response._embedded && response._embedded.datosDetalleBeneficiarioList) {
          this.beneficiarios = response._embedded.datosDetalleBeneficiarioList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los beneficiarios.' });
        console.error('Error fetching beneficiarios from link', error);
      }
    });
  }

}
