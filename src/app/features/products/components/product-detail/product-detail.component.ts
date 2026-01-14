import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@core';
import { ProductService } from '@features/products';
import { LoadingSpinnerComponent } from '@shared';

/**
 * Product Detail Component
 * Displays detailed information about a single product
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  product: Product | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.error = 'Product ID not found';
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById({ id }).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess && result.data) {
          this.product = result.data;
        } else {
          this.error = result.error || 'Failed to load product';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'An error occurred while loading the product';
        console.error(err);
      },
    });
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit']);
    }
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.productService.deleteProduct({ id: this.product.id }).subscribe({
        next: (result) => {
          if (result.isSuccess) {
            this.router.navigate(['/products']);
          } else {
            alert(result.error || 'Failed to delete product');
          }
        },
        error: (err) => {
          alert('An error occurred while deleting the product');
          console.error(err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
