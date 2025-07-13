import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-form-erorr-label',
  imports: [],
  templateUrl: './form-erorr-label.component.html',
})
export class FormErorrLabelComponent {
  control = input.required<AbstractControl>();

  get errorMessage(): string | null {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;
  }
}
