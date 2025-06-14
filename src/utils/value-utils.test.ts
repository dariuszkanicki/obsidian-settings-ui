// import { describe, expect, it } from 'vitest';

// export interface TestStructure {
//   testNumber: number,
//   testToggle: boolean,
//   testString: string,
// }

// function testCoerceValue() {
//   describe('coerceValue(number)', () => {
//     const element: PathSetting<number> = {
//       type: 'Numberfield',
//       path: "toString"
//     };

//     it('coerces number as string to number', () => { expect(coerceValue<number>(element, '20')).toBe(20); });
//     it('throws error if input is NaN',       () => { expect(() => coerceValue<number>(element, 'abc')).toThrowError('wrong input abc'); });
//     it('throws error if input is null',      () => { expect(() => coerceValue<number>(element, null)).toThrowError('wrong input null'); });
//     it('returns 0 if empty string',          () => { expect(coerceValue<number>(element, '')).toBe(0); });
//   });
//   // Boolean coercion
//   describe('coerceValue(boolean)', () => {
//     const element: PathSetting<boolean> = {
//       type: 'Toggle',
//       path: "valueOf"
//     };

//     it('coerces string "false" → false',     () => { expect(coerceValue<boolean>(element, 'false')).toBe(false); });
//     it('coerces string "true" → true',       () => { expect(coerceValue<boolean>(element, 'true')).toBe(true); });
//     it('coerces string "maybe" → false',     () => { expect(coerceValue<boolean>(element, 'maybe')).toBe(false); });
//     it('coerces string null → false',        () => { expect(coerceValue<boolean>(element, null)).toBe(false); });
//   });
//   //   // String coercion
//   describe('coerceValue(string)', () => {
//     const element: PathSetting<string> = {
//       type: 'Textfield',
//       path: "toString"
//     };
//     it('trim string " new " → "new"',     () => { expect(coerceValue<string>(element, ' new ')).toBe('new'); });
//     it('coerces number 123 → "123"',       () => { expect(coerceValue<string>(element, 123)).toBe('123'); });
//     it('coerces true → "true"',            () => { expect(coerceValue<string>(element, true)).toBe('true'); });
//     it('coerces null → "null"',           () => { expect(coerceValue<string>(element, null)).toBe('null'); });
//   });
// }

// testCoerceValue();
