/**
 * Core layer barrel export
 * Domain layer with ZERO dependencies on infrastructure
 *
 * Contains:
 * - Entities: Pure TypeScript domain models
 * - Interfaces: Abstractions for all external dependencies
 * - Models: Result patterns, DTOs
 * - Enums: Shared enumerations
 */
export * from './entities';
export * from './enums';
export * from './interfaces';
export * from './models';
