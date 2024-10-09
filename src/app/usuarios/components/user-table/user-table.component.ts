import { Component, EventEmitter, Output } from '@angular/core';
import { HateoasResponse, Links, Usuario } from '../../interfaces/user.interface';
import { UsuarioService } from '../../service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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

  constructor(private usuarioService: UsuarioService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService) {}

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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los usuarios.' });
        console.error('Error fetching usuarios', error);
      }
    });
  }


  onEdit(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas editar al usuario ${usuario.usuario}?`,
      header: 'Confirmar Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editUsuario.emit(usuario);
        this.messageService.add({ severity: 'info', summary: 'Edición Confirmada', detail: 'Editando usuario.' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La edición fue cancelada.' });
      }
    })
  }

  confirmDelete(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas deshabilitar al usuario ${usuario.usuario}?`,
      header: 'Confirmar Deshabilitación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.deshabilitarUsuario(usuario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Usuario Deshabilitado', detail: 'El usuario fue deshabilitado correctamente.' });
            this.loadUsuarios(this.currentPage);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar al usuario.' });
            console.error('Error al deshabilitar el usuario', error);
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La deshabilitación fue cancelada.' });
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los usuarios desde el enlace.' });
        console.error('Error fetching usuarios from link', error);
      }
    });
  }

}
