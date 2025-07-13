import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static passwordPattern =
    '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{6,}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return this.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldArrayError(
    formArray: FormArray,
    index: number
  ): string | null {
    if (!formArray.controls.length) return null;

    const errors = formArray.controls[index].errors;

    return this.getTextError(errors);
  }

  static getTextError(errors: ValidationErrors | null): string | null {
    errors = errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;
        case 'email':
          return 'El valor ingresado no es un correo electrónico';
        case 'emailTaken':
          return 'El correo electrónico ya está siendo usado por otro usuario';
        case 'noStrider':
          return 'El nombre de usuario no puede ser "strider"';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }

          if (errors['pattern'].requiredPattern === FormUtils.passwordPattern) {
            return 'La contraseña debe de contener al menos una mayúscula, un número y un simbolo';
          }
          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }
    return null;
  }

  static isFieldOneEqualFieldTwo(field: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value
        ? null
        : {
            passwordsNotEqual: true,
          };
    };
  }
}
