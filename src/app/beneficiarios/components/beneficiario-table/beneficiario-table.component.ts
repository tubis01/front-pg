import { Component, EventEmitter, Output } from '@angular/core';
import { Beneficiario, HateoasResponse, Links } from '../../interfaces/beneficiario.interface';
import { BeneficiarioService } from '../../services/beneficiario.service';

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

  constructor(private beneficiarioService: BeneficiarioService) {}

  ngOnInit(): void {
    this.loadBeneficiarios(this.currentPage);
  }

  loadBeneficiarios(page: number): void {
    this.beneficiarioService.getBeneficiarios(page, this.pageSize)
      .subscribe(
        (response: HateoasResponse<Beneficiario>) => {
          if (response._embedded && response._embedded.datosDetalleBeneficiarioList) {
            this.beneficiarios = response._embedded.datosDetalleBeneficiarioList;
          }
          this.links = response._links;
          this.currentPage = response.page.number;
          this.totalPages = response.page.totalPages;
          this.totalElements = response.page.totalElements;
        },
        error => {
          console.error('Error fetching beneficiarios', error);
        }
      );
  }

  onPageChange(event: any): void {
    const page = event.page;
    this.loadBeneficiarios(page);
  }

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
    this.beneficiarioService.getBeneficiarioByUrl(url)
      .subscribe(
        (response: HateoasResponse<Beneficiario>) => {
          if (response._embedded && response._embedded.datosDetalleBeneficiarioList) {
            this.beneficiarios = response._embedded.datosDetalleBeneficiarioList;
          }
          this.links = response._links;
          this.currentPage = response.page.number;
          this.totalPages = response.page.totalPages;
          this.totalElements = response.page.totalElements;
        },
        error => {
          console.error('Error fetching beneficiarios from link', error);
        }
      );
  }

  onEdit(beneficiario: Beneficiario): void {
    console.log('Editing beneficiario', beneficiario);
    this.editBeneficiario.emit(beneficiario);
  }

  confirmDelete(beneficiario: Beneficiario): void {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${beneficiario.primerNombre} ${beneficiario.primerApellido}?`)) {
      this.beneficiarioService.deleteBeneficiario(beneficiario.id).subscribe(
        () => {
          this.loadBeneficiarios(this.currentPage);
        },
        error => {
          console.error('Error al eliminar el beneficiario', error);
        }
      );
    }
  }

}
