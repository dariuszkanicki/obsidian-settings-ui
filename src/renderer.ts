import {
  AbstractTextComponent,
  Setting,
  TextAreaComponent,
  TextComponent,
  ToggleComponent,
  ValueComponent,
} from 'obsidian';
import { Context, Toggle, Button, Dropdown, Textfield, SettingGroup, SettingsSectionConfig, SettingElement } from '.';
import { Path } from './utils/path';
import { Helper } from './utils/helper';
import { StatusRenderer } from './renderer/status-renderer';
import { TextfieldRenderer } from './renderer/textfield-renderer';
import { ToggleRenderer } from './renderer/toggle-renderer';
import { ButtonRenderer } from './renderer/button-renderer';
import { DropdownRenderer } from './renderer/dropdown-renderer';
import { AbstractRenderer } from './renderer/abstract-renderer';
import { Html } from './utils/html';

const rendererRegistry: Record<string, new () => AbstractRenderer<any>> = {
  Button: ButtonRenderer,
  Dropdown: DropdownRenderer,
  Status: StatusRenderer,
  Textfield: TextfieldRenderer,
  Toggle: ToggleRenderer,
};

export class Renderer<T extends Record<string, any>> {
  private context: Context<T>;

  constructor(
    private pluginId: string,
    private config: SettingsSectionConfig<T>,
    private settings: T,
    private container: HTMLElement,
    private saveData: (settings: T) => Promise<void>
  ) {
    this.context = {
      pluginId: this.pluginId,
      settings: this.settings,
      saveData: this.saveData,
    };
  }

  renderSettings() {
    this.container.empty();

    if (this.config.howTo) {
      this._renderHowToSection();
    }

    for (const el of this.config.elements) {
      if ('type' in el && el.type === 'SettingGroup') {
        const bodyEl = this._renderGroup(el);
        el.items.forEach((item) => this._renderElement(bodyEl, item, true));
      } else {
        this._renderElement(this.container, el);
      }
    }
  }

  private _renderElement(container: HTMLElement, el: SettingElement<T>, groupMember = false) {
    if (el.showIf === false) return;

    const renderer = new rendererRegistry[el.type]();
    // console.log('registry', rendererRegistry);
    // console.log('type', el.type);
    // console.log('renderer', renderer);
    renderer.render(this.context, container, el, groupMember);
    //   default:
    //     console.warn('Unknown settings element type', el);
    // }
  }

  private _renderHowToSection() {
    const { title, description, readmeURL, classes = {} } = this.config.howTo!;

    // const wrapper = this.container.createEl('div', {
    //   cls: css('dkani-ui-group'),
    // });

    // const header = wrapper.createEl('div', {
    //   cls: css('dkani-ui-group-header'),
    // });

    // const toggleIcon = header.createSpan({
    //   cls: css('dkani-ui-group-toggle'),
    // });
    // toggleIcon.textContent = '▼';

    // const titleEl = header.createEl('div', {
    //   cls: css('dkani-ui-group-title'),
    // });
    // setParsedName(titleEl, title ?? 'How to use this plugin');

    // const body = wrapper.createDiv({
    //   cls: css('dkani-ui-group-body'),
    // });

    // const desc = body.createEl('small', {
    //   text: description,
    //   cls: classes.description ?? css('dkani-ui-howto-text'),
    // });

    /*
    if (readmeURL) {
      desc.createEl('br');
      desc.createEl('br');
      desc.createEl('span', { text: 'See the ' });
      desc.createEl('a', {
        href: readmeURL,
        text: 'README',
        title: readmeURL,
      });
      desc.createEl('span', {
        text: ' for more information and troubleshooting.',
      });
    }

    const key = 'dkani-ui-howto';
    let expanded = localStorage.getItem(key) !== 'false';

    const applyState = () => {
      if (expanded) {
        body.style.maxHeight = 'none';
        toggleIcon.setText('▼');
        body.classList.remove('collapsed');
      } else {
        body.style.maxHeight = '0px';
        toggleIcon.setText('▶');
        body.classList.add('collapsed');
      }
    };

    const toggle = () => {
      expanded = !expanded;
      localStorage.setItem(key, String(expanded));

      if (expanded) {
        body.classList.remove('collapsed');
        body.style.maxHeight = body.scrollHeight + 'px';
        toggleIcon.setText('▼');
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
          body.style.maxHeight = '0px';
        });
        toggleIcon.setText('▶');
        body.classList.add('collapsed');
      }
    };

    toggleIcon.addEventListener('click', toggle);
    titleEl.addEventListener('click', toggle);

    body.addEventListener('transitionend', () => {
      if (expanded) body.style.maxHeight = 'none';
    });

    applyState();
    */
  }

  private _renderGroup(el: SettingGroup<T>): HTMLElement {
    const html = new Html(this.pluginId, this.container, 'dkani-ui');
    // prettier-ignore
    html.createDIV('group')
      .createDIV('group-header')
        .createSPAN('group-toggle', '▼')
          .and()
        .createDIV('group-title',el.label)
          .and()
        .and()
      .createDIV('group-body');

    // const groupEl = this.container.createEl('div', { cls: css('dkani-ui-group')});
    // const headerEl = groupEl.createEl('div', {cls: css('dkani-ui-group-header')});
    // const toggleIcon = headerEl.createSpan({cls: css('dkani-ui-group-toggle')});
    // toggleIcon.textContent = '▼';
    // const titleEl = headerEl.createEl('div', {cls: css('dkani-ui-group-title')});
    // setParsedName(titleEl, el.label);
    // const bodyEl = groupEl.createDiv({cls: css('dkani-ui-group-body')});

    const key = `dkani-ui-group:${el.label}`;
    let expanded = localStorage.getItem(key) !== 'false';
    const bodyEl = html.getElement('group-body');
    const toggleIcon = html.getElement('group-toggle');

    const applyState = () => {
      if (expanded) {
        bodyEl.style.maxHeight = 'none';
        toggleIcon.setText('▼');
        bodyEl.classList.remove('collapsed');
      } else {
        bodyEl.style.maxHeight = '0px';
        toggleIcon.setText('▶');
        bodyEl.classList.add('collapsed');
      }
    };

    const toggle = () => {
      expanded = !expanded;
      localStorage.setItem(key, String(expanded));
      if (expanded) {
        bodyEl.classList.remove('collapsed');
        bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
        toggleIcon.setText('▼');
      } else {
        bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
        requestAnimationFrame(() => (bodyEl.style.maxHeight = '0px'));
        toggleIcon.setText('▶');
        bodyEl.classList.add('collapsed');
      }
    };

    toggleIcon.addEventListener('click', toggle);
    // titleEl.addEventListener('click', toggle);
    bodyEl.addEventListener('transitionend', () => {
      if (expanded) bodyEl.style.maxHeight = 'none';
    });

    applyState();
    return bodyEl;
  }
}
