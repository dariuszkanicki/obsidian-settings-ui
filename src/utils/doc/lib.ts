import 'source-map-support/register.js';
import { Logger } from './logger.js';

export type TypeKind = 'interface' | 'type' | 'unknown';

export interface TypeDefinition {
  name: string;
  extends?: string;
  properties?: Record<string, string>;
}

const whiteOnRed = '\x1b[37m\x1b[41m';
const resetColor = '\x1b[0m';
const logger = new Logger(false);

function catchError(e: Error) {
  const stackLines = e.stack?.split('\n') ?? [];
  // Find the first line that doesn't point to catchError
  const relevantLine = stackLines.find((line) => line.includes('.ts:') && !line.includes('catchError'));
  const match = relevantLine?.match(/([^\\/]+\.ts):(\d+):(\d+)/); // file, line, column

  if (match) {
    const [, file, line, column] = match;
    console.error(`${whiteOnRed} ### ERROR:${resetColor} ${file}:${line}: ${e.message}`);
  } else {
    console.error(`Error: ${e.message}`);
  }
  process.exit(1);
}

function indentProperties(body: string): string {
  return body
    .split('\n')
    .map((line) => '  ' + line.trim())
    .join('\n');
}

// const typePattern = /(?<prefix>\(\)=>)(?<name><[^>]+>)(?<suffix>.*)/g;
// const typePattern = /(?:(?<prefix>\(\)=>))?(?<name><[^>]+>)(?<suffix>.*)/g;
// if (value.startsWith('()')) {
//   value = value.replaceAll(' ', '');
// }
