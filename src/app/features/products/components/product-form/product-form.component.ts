import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductCommand, ProductService, UpdateProductCommand } from '@features/products';

/**
 * Product Form Component
 * Handles creating and editing products
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  loading = false;
  error: string | null = null;

  formData = {
    name: '',
    sku: '',
    price: 0,
    stockQuantity: 0,
    description: null as string | null,
    categoryId: null as string | null,
    isActive: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'create') {
      this.isEditMode = true;
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProductById({ id }).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess && result.data) {
          const product = result.data;
          this.formData = {
            name: product.name,
            sku: product.sku,
            price: product.price,
            stockQuantity: product.stockQuantity,
            description: product.description,
            categoryId: product.categoryId,
            isActive: product.isActive,
          };
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

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    const command: CreateProductCommand = {
      name: this.formData.name,
      sku: this.formData.sku,
      price: this.formData.price,
      stockQuantity: this.formData.stockQuantity,
      description: this.formData.description,
      categoryId: this.formData.categoryId,
    };

    this.productService.createProduct(command).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess && result.data) {
          this.router.navigate(['/products', result.data]);
        } else {
          this.error = result.error || 'Failed to create product';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'An error occurred while creating the product';
        console.error(err);
      },
    });
  }

  updateProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const command: UpdateProductCommand = {
      id,
      name: this.formData.name,
      sku: this.formData.sku,
      price: this.formData.price,
      stockQuantity: this.formData.stockQuantity,
      description: this.formData.description,
      categoryId: this.formData.categoryId,
      isActive: this.formData.isActive,
    };

    this.productService.updateProduct(command).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess) {
          this.router.navigate(['/products', id]);
        } else {
          this.error = result.error || 'Failed to update product';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'An error occurred while updating the product';
        console.error(err);
      },
    });
  }

  cancel(): void {
    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigate(['/products', id]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
