import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'ProductImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {
    if (!value) return `./assets/images/no-image.jpg`;

    if (typeof value === 'string' && value.startsWith('blob:')) return value;
    if (typeof value === 'string' && value) {
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value.at(0);

    if (!image) return `./assets/images/no-image.jpg`;

    return `${baseUrl}/files/product/${image}`;
  }
}
