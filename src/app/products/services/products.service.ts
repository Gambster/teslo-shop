import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/products.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 12, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap(console.log),
        tap((response) => this.productsCache.set(key, response))
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const key = idSlug;

    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((product) => this.productCache.set(key, product)));
  }
  getProductById(id: string): Observable<Product> {
    if (id === 'new') return of(emptyProduct);

    const key = id;

    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(key, product)));
  }

  updateProduct(
    productId: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images || [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.patch<Product>(
          `${baseUrl}/products/${productId}`,
          updatedProduct
        )
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images || [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.http.post<Product>(`${baseUrl}/products`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.productCache.set(productId, product);

    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((response) => response.fileName));
  }
}
