import { Component, EventEmitter, Output } from '@angular/core';
import { HateoasResponse, Links, Usuario } from '../../interfaces/user.interface';
import { UsuarioService } from '../../service/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  public usuarios: Usuario[] = [];
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;
  public links: Links | undefined;

  @Output() editUsuario = new EventEmitter<Usuario>();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios(this.currentPage);
  }

  loadUsuarios(page: number): void {
    this.usuarioService.listarUsuarios(page, this.pageSize).subscribe({
      next: (response: HateoasResponse<Usuario>) => {
        if (response._embedded?.datosDetalleUsuarioList) {
          this.usuarios = response._embedded.datosDetalleUsuarioList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching usuarios', error);
      }
    });
  }

  onPageChange(event: any): void {
    const page = event.page;
    this.loadUsuarios(page);
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
    this.usuarioService.listarUsuariosByUrl(url).subscribe({
      next: (response: HateoasResponse<Usuario>) => {
        if (response._embedded?.datosDetalleUsuarioList) {
          this.usuarios = response._embedded.datosDetalleUsuarioList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      },
      error: (error) => {
        console.error('Error fetching usuarios from link', error);
      }
    });
  }

  onEdit(usuario: Usuario): void {
    this.editUsuario.emit(usuario);
  }

  confirmDelete(usuario: Usuario): void {
    if (confirm(`¿Estás seguro de que deseas deshabilitar a ${usuario.usuario}?`)) {


      this.usuarioService.deshabilitarUsuario(usuario.id).subscribe({
        next: () => {
          this.loadUsuarios(this.currentPage);
        },
        error: (error) => {
          console.error('Error al deshabilitar el usuario', error);
        }
      });
    }
  }

}
