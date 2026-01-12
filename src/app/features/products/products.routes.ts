import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: 'create',
    component: ProductFormComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  },
  {
    path: ':id/edit',
    component: ProductFormComponent
  }
];
