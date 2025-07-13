import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductsTableComponent } from '@products/components/products-table/products-table.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  paginationService = inject(PaginationService);
  productsService = inject(ProductsService);

  pageLength = signal<number>(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      pageLength: this.pageLength(),
    }),
    loader: ({ request }) => {
      const { page, pageLength } = request;
      return this.productsService.getProducts({
        limit: pageLength,
        offset: page * pageLength,
      });
    },
  });
}
