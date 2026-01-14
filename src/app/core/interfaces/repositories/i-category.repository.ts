import { InjectionToken } from '@angular/core';
import { Category } from '@core';
import { IBaseRepository } from './i-base.repository';

/**
 * Category repository interface
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICategoryRepository extends IBaseRepository<Category> {}

/**
 * Injection token for ICategoryRepository
 */
export const ICategoryRepository = new InjectionToken<ICategoryRepository>('ICategoryRepository');
