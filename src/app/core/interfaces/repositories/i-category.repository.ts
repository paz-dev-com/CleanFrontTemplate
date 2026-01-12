import { InjectionToken } from '@angular/core';
import { Category } from '../../entities/category.entity';
import { IBaseRepository } from './i-base.repository';

/**
 * Category repository interface
 */
export interface ICategoryRepository extends IBaseRepository<Category> {
}

/**
 * Injection token for ICategoryRepository
 */
export const ICategoryRepository = new InjectionToken<ICategoryRepository>('ICategoryRepository');
