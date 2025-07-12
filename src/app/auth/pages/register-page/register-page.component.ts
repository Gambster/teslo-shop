import { Component, inject, signal } from '@angular/core';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  faUser = faUser;
  faLock = faLock;
  formUtils = FormUtils;

  hasError = signal<boolean>(false);

  registerForm = this.fb.group(
    {
      fullName: [
        '',
        [Validators.required, Validators.pattern(FormUtils.namePattern)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(FormUtils.passwordPattern)],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword'),
      ],
    }
  );

  onSubmit() {
    const formValues = this.registerForm.value;
    this.authService
      .register({
        fullName: formValues.fullName!,
        email: formValues.email!,
        password: formValues.password!,
      })
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      });
  }
}
