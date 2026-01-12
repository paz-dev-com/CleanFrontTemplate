import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncate Pipe
 * Truncates text to specified length
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, ellipsis = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + ellipsis;
  }
}
