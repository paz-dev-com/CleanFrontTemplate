import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginatedResult, Product } from '@core';
import { ProductService } from '@features/products';

/**
 * Product List Component
 * Presentation layer for displaying products
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  products: Product[] = [];
  paginatedResult: PaginatedResult<Product> | null = null;
  loading = false;
  error: string | null = null;
  searchTerm = '';

  private currentPage = 1;
  private pageSize = 10;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService
      .getProducts({
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        searchTerm: this.searchTerm || undefined,
      })
      .subscribe({
        next: (result) => {
          this.loading = false;
          if (result.isSuccess && result.data) {
            this.paginatedResult = result.data;
            this.products = result.data.items;
          } else {
            this.error = result.error || 'Failed to load products';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'An error occurred while loading products';
          console.error(err);
        },
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  viewProduct(id: string): void {
    this.router.navigate(['/products', id]);
  }

  createProduct(): void {
    this.router.navigate(['/products', 'create']);
  }

  nextPage(): void {
    if (this.paginatedResult?.hasNextPage) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.paginatedResult?.hasPreviousPage) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
