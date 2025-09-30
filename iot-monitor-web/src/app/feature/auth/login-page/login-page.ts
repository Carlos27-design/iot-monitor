import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material-module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthData } from '../../../core/services/auth-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private authData = inject(AuthData);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open('El formulario es invalido', 'Cerrar', {
        duration: 5000,
      });

      return;
    }

    const { email, password } = this.loginForm.value;

    this.authData.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
        this.snackBar.open(`Bienvenido ${email}`, 'Cerrar', {
          duration: 5000,
        });
      } else {
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', {
          duration: 5000,
        });
      }
    });
  }
}
