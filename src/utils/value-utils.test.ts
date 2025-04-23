import { describe, expect, it } from 'vitest';
import { coerceValue } from './value-utils';

function testCoerceValue() {
  // Number coercion
  describe('coerceValue(number)', () => {
    it('coerces number as string to number', () => {
      expect(coerceValue<number>(10, '20')).toBe(20);
    });

    it('returns original number if NaN', () => {
      expect(coerceValue<number>(10, 'abc')).toBe(10);
    });

    it('returns original number if null', () => {
      expect(coerceValue<number>(10, null)).toBe(10);
    });
    it('returns 0 if empty', () => {
      expect(coerceValue<number>(10, '')).toBe(0);
    });
  });

  // Boolean coercion
  describe('coerceValue(boolean)', () => {
    it('coerces string "false" → false', () => {
      expect(coerceValue<boolean>(true, 'false')).toBe(false);
    });

    it('coerces string "true" → true', () => {
      expect(coerceValue<boolean>(false, 'true')).toBe(true);
    });

    it('returns original if NaN', () => {
      expect(coerceValue<boolean>(false, 'maybe')).toBe(false);
    });

    it('returns original if null', () => {
      expect(coerceValue<boolean>(true, null)).toBe(true);
    });
  });

  //   // String coercion
  describe('coerceValue(string)', () => {
    it('coerces string "abc" → false', () => {
      expect(coerceValue<string>('abc', ' new ')).toBe('new'); // trim
    });

    it('coerces string "true" → true', () => {
      expect(coerceValue<string>('abc', 123)).toBe('123'); // number to string
    });

    it('returns original if NaN', () => {
      expect(coerceValue<string>('abc', true)).toBe('true');
    });

    it('returns original if null', () => {
      expect(coerceValue<string>('abc', null)).toBe('null');
    });
  });
}

testCoerceValue();
