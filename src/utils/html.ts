import { addCodeHighlightedText } from './helper';

export enum Tag {
  Open,
  close,
}

export class Html {
  private containers: HTMLElement[] = [];
  private cssPrefix: string;
  private elementMap = new Map<string, HTMLElement>();

  constructor(private pluginId: string, htmlElement: HTMLElement, cssPrefix: string) {
    this.containers.push(htmlElement);
    this.cssPrefix = `${pluginId}-${cssPrefix}`;
  }

  getElement(className: string) {
    return this.elementMap.get(className);
  }

  createDIV(className: string, text?: string, tag: Tag = Tag.Open): Html {
    this.containers.push(this._last().createDiv({ cls: this._css(className) }));
    if (text) {
      addCodeHighlightedText(this._last(), this.pluginId, text);
    }
    this.elementMap.set(className, this._last());
    if (tag === Tag.close) {
      this.containers.pop();
    }
    return this;
  }
  createSPAN(className: string, textContent: string, tag: Tag = Tag.Open) {
    this.containers.push(this._last().createSpan({ cls: this._css(className) }));
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
  private _css(className: string) {
    return `${this.cssPrefix}-${className}`;
  }
  private _last(): HTMLElement {
    return this.containers.at?.(-1)!;
  }
}
