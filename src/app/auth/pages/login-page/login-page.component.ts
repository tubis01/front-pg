import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/AuthResponse.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({});


  constructor(private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
      ) {}

      ngOnInit(): void {
        // Validaciones del formulario
        this.loginForm = this.fb.group({
          usuario: ['', [Validators.required, Validators.minLength(3)]], // Mínimo 3 caracteres
          contrasena: ['', [Validators.required, Validators.minLength(6)]] // Mínimo 6 caracteres
        });
      }
      onLogin(): void {
        if (this.loginForm.invalid) {
          // Mostrar un mensaje de advertencia cuando el formulario no es válido
          this.messageService.add({
            severity: 'warn',
            summary: 'Campos inválidos',
            detail: 'Por favor, revisa los campos del formulario.',
          });
          return;
        }

        const { usuario, contrasena } = this.loginForm.value;
        this.authService.login(usuario, contrasena).subscribe({
          next: (response: AuthResponse) => {
            this.authService.setToken(response.token);
            this.authService.setRoles(response.roles);
            this.authService.setUserName(response.userName);
            this.router.navigate(['/tablero']);
            this.messageService.add({
              severity: 'success',
              summary: 'Inicio de sesión exitoso',
              detail: 'Bienvenido ' +  `[ ${response.userName} ]`,
            });
          },
          error: (error) => {
            this.resetForm();
            this.messageService.add({
              severity: 'error',
              summary: 'Error al iniciar sesión',
              detail: 'Usuario o contraseña incorrectos',

            });
          }
        });
      }

      resetForm(): void {
        this.loginForm.reset();
      }
    }

