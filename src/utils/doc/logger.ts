export class Logger {
  private enabled: boolean;

  constructor(enabled = false) {
    this.enabled = enabled;
  }

  log(text: unknown) {
    if (this.enabled) {
      console.log(text);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  filter(name: string, kind: string, body: string) {
    // You could dynamically enable/disable here
    // Example:
    this.enabled = /\/\/userDoc/.test(body);
  }
}
