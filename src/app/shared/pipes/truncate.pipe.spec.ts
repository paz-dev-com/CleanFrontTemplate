import { describe, expect, it } from 'vitest';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  describe('transform', () => {
    it('should return empty string for empty input', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should return empty string for null input', () => {
      expect(pipe.transform(null as any)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(pipe.transform(undefined as any)).toBe('');
    });

    it('should return original text when length is less than limit', () => {
      const text = 'Short text';
      expect(pipe.transform(text, 50)).toBe('Short text');
    });

    it('should return original text when length equals limit', () => {
      const text = 'A'.repeat(50);
      expect(pipe.transform(text, 50)).toBe(text);
    });

    it('should truncate text when length exceeds limit', () => {
      const text = 'This is a very long text that should be truncated';
      const result = pipe.transform(text, 20);

      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 chars + '...'
    });

    it('should use default limit of 50 when not specified', () => {
      const text = 'A'.repeat(60);
      const result = pipe.transform(text);

      expect(result).toBe('A'.repeat(50) + '...');
    });

    it('should use default ellipsis "..." when not specified', () => {
      const text = 'This is a long text';
      const result = pipe.transform(text, 10);

      expect(result).toContain('...');
      expect(result).toBe('This is a ...');
    });

    it('should use custom ellipsis when provided', () => {
      const text = 'This is a long text';
      const result = pipe.transform(text, 10, '…');

      expect(result).toBe('This is a …');
    });

    it('should use custom ellipsis with multiple characters', () => {
      const text = 'This is a long text';
      const result = pipe.transform(text, 10, ' [...]');

      expect(result).toBe('This is a  [...]');
    });

    it('should handle very short limit', () => {
      const text = 'Hello World';
      const result = pipe.transform(text, 5);

      expect(result).toBe('Hello...');
    });

    it('should handle limit of 1', () => {
      const text = 'Hello';
      const result = pipe.transform(text, 1);

      expect(result).toBe('H...');
    });

    it('should handle limit of 0', () => {
      const text = 'Hello';
      const result = pipe.transform(text, 0);

      expect(result).toBe('...');
    });

    it('should preserve special characters before truncation', () => {
      const text = 'Test@#$%^&*()_+ with special chars';
      const result = pipe.transform(text, 15);

      expect(result).toBe('Test@#$%^&*()_+...');
    });

    it('should handle text with newlines', () => {
      const text = 'Line 1\nLine 2\nLine 3 is very long';
      const result = pipe.transform(text, 20);

      expect(result.length).toBe(23);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle text with unicode characters', () => {
      const text = 'Hello 世界 🌍 Unicode test';
      const result = pipe.transform(text, 15);

      // Emoji counts as 2 chars, so at length 15 we get: "Hello 世界 🌍 Uni..."
      expect(result).toBe('Hello 世界 🌍 Uni...');
    });

    it('should handle empty ellipsis', () => {
      const text = 'This is a long text';
      const result = pipe.transform(text, 10, '');

      expect(result).toBe('This is a ');
      expect(result.length).toBe(10);
    });

    it('should work with very long text', () => {
      const text = 'A'.repeat(1000);
      const result = pipe.transform(text, 50);

      expect(result).toBe('A'.repeat(50) + '...');
      expect(result.length).toBe(53);
    });
  });
});
