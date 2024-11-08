import { Component, EventEmitter, Output } from '@angular/core';
import { HateoasResponse, Links, Usuario } from '../../interfaces/user.interface';
import { UsuarioService } from '../../service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { CacheService } from '../../../dashboard/services/cache.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styles: ''
})
export class UserTableComponent {
  public usuarios: Usuario[] = [];
  public currentPage: number = 0;
  public totalPages: number = 1;
  public totalElements: number = 0;
  public pageSize: number = 20;
  public links: Links | undefined;


  public isLoading: boolean = false;

  @Output() editUsuario = new EventEmitter<Usuario>();

  constructor(private usuarioService: UsuarioService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private cacheService: CacheService
    ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.listarUsuarios().pipe(
      tap((response: HateoasResponse<Usuario>) => {
        // Procesa la respuesta aquí
        if (response._embedded?.datosDetalleUsuarioList) {
          this.usuarios = response._embedded.datosDetalleUsuarioList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.isLoading = false;
      }),
      catchError(error => {
        // Manejo de errores aquí
        this.isLoading = false;
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los usuarios.' });
        return of(); // Retornar un observable vacío para no romper el flujo
      })
    ).subscribe();
  }

  onEdit(usuario: Usuario): void {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas editar al usuario ${usuario.usuario}?`,
      header: 'Confirmar Edición',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.editUsuario.emit(usuario);
        this.messageService.add({ severity: 'info', summary: 'Edición Confirmada', detail: 'Editando usuario.' });
        this.isLoading = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La edición fue cancelada.' });
        this.isLoading = false;
      }
    })
  }

  confirmDelete(usuario: Usuario): void {
    this.isLoading = true;
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas deshabilitar al usuario ${usuario.usuario}?`,
      header: 'Confirmar Deshabilitación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.deshabilitarUsuario(usuario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Usuario Deshabilitado', detail: 'El usuario fue deshabilitado correctamente.' });
            this.cacheService.delete('usuarios_lista'); // Eliminar la caché
            this.loadUsuarios();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo deshabilitar al usuario.' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación Cancelada', detail: 'La deshabilitación fue cancelada.' });
        this.isLoading = false;
      }
    });
  }


  onSearch(term: string): void {
    this.isLoading = true;

    if (term && term.trim().length > 0) {
      this.usuarioService.buscarPorUsuario(term, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.usuarios = data; // Mostrar los beneficiarios filtrados
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    } else {
      // Si no hay término de búsqueda, volver a cargar todos los beneficiarios automáticamente
      this.loadUsuarios();
      this.isLoading = false;
    }
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
    this.isLoading = true;
    this.usuarioService.listarUsuariosByUrl(url).subscribe({
      next: (response: HateoasResponse<Usuario>) => {
        if (response._embedded?.datosDetalleUsuarioList) {
          this.usuarios = response._embedded.datosDetalleUsuarioList;
        }
        this.links = response._links;
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los usuarios desde el enlace.' });
      }
    });
  }

}
