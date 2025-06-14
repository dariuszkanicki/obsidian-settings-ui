import { highlightAsCode, css } from './helper.js';

export enum Tag {
  Open,
  close,
}

export class Html {
  private containers: HTMLElement[] = [];
  private elementMap = new Map<string, HTMLElement>();

  constructor(htmlElement: HTMLElement) {
    this.containers.push(htmlElement);
  }

  getElement(className: string) {
    return this.elementMap.get(className);
  }

  createDIV(className: string, text?: string, tag: Tag = Tag.Open): Html {
    this.containers.push(this._last().createDiv({ cls: css(className) }));
    if (text) {
      highlightAsCode(this._last(), text);
    }
    this.elementMap.set(className, this._last());
    if (tag === Tag.close) {
      this.containers.pop();
    }
    return this;
  }
  createSPAN(className: string, textContent: string, tag: Tag = Tag.Open) {
    this.containers.push(this._last().createSpan({ cls: css(className) }));
    this._last().textContent = textContent;
    this.elementMap.set(className, this._last());
    if (tag === Tag.close) {
      this.containers.pop();
    }
    return this;
  }

  closeTag() {
    this.containers.pop();
    return this;
  }
  private _last(): HTMLElement {
    const el = this.containers.at?.(-1);
    if (!el) {
      throw new Error('No container available');
    }
    return el;
  }
}
