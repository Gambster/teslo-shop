import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/products.interface';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  baseUrl = baseUrl;
  product = input.required<Product>();
  imgUrl = computed(() => {
    return `${baseUrl}/files/product/${this.product().images[0]}`;
  });
}
