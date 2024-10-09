import { Component, EventEmitter, Output } from '@angular/core';
import { Beneficiario, HateoasResponse, Links } from '../../interfaces/beneficiario.interface';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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

  @Output() editBeneficiario = new EventEmitter<Beneficiario>();


  constructor(
    private beneficiarioService: BeneficiarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiarios(this.currentPage);
  }

  loadBeneficiarios(page: number): void {
    this.beneficiarioService.getBeneficiarios(page, this.pageSize).subscribe({
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
        console.error('Error fetching beneficiarios', error);
      }
    });
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
