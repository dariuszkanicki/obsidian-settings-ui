export abstract class AbstractRenderer {
  constructor(private element: unknown) {}

  render(container: HTMLElement, _groupMember: boolean): void {
    this.createElement(container, this.element);
  }
  protected abstract createElement(container: HTMLElement, element: unknown): void;
}
