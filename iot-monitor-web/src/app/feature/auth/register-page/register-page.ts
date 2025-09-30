import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material-module';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthData } from '../../../core/services/auth-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private formBuilder = inject(FormBuilder);
  private authData = inject(AuthData);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open('El formulario es invalido', 'Cerrar', {
        duration: 5000,
      });

      return;
    }

    const { fullName, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 5000,
      });
    }

    this.authData.register(fullName!, email!, password!).subscribe((isRegistered) => {
      if (isRegistered) {
        this.router.navigate(['/auth/login']);
        this.snackBar.open('Registrado con exito', 'Cerrar', {
          duration: 5000,
        });
      }
    });
  }
}
