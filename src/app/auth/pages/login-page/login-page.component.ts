import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/AuthResponse.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;
      this.authService.login(usuario, contrasena).subscribe({
        next: (response: AuthResponse) => {
          this.authService.setToken(response.token);
          this.authService.setRoles(response.roles);
          this.authService.setUserName(response.userName);
          this.router.navigate(['/tablero']);
        },
        error: error => {
          console.error('Error al iniciar sesión', error);
          alert('Usuario o contraseña incorrectos');
        },
        complete: () => {
          console.log('Proceso de inicio de sesión completo');
        }
      });
    }
  }
}
