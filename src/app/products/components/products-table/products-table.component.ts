import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/products.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'products-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  products = input.required<Product[]>();
}
