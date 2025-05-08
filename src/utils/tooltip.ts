export function createTooltip(
  triggerEl: HTMLElement,
  text: string,
  options?: {
    delay?: number;
    position?: 'top' | 'bottom' | 'left' | 'right';
  },
) {
  const delay = options?.delay ?? 0;
  const position = options?.position ?? 'top';

  let tooltipEl: HTMLDivElement | null = null;

  const show = () => {
    if (tooltipEl) return;

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'dkani-floating-tooltip';
    tooltipEl.innerHTML = text.replace(/\n/g, '<br>'); // <-- handle multi-line here!
    Object.assign(tooltipEl.style, {
      position: 'absolute',
      zIndex: '10000',
      background: 'var(--background-secondary)',
      color: 'var(--text-normal)',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '13px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      whiteSpace: 'pre-line', // <-- allow line breaks properly
      pointerEvents: 'none',
      transition: 'opacity 0.15s ease-in-out',
      opacity: '0',
      maxWidth: '300px',
    });

    document.body.appendChild(tooltipEl);

    const rect = triggerEl.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();

    let top = 0,
      left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tipRect.height - 8;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.left - tipRect.width - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.right + 8;
        break;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;

    requestAnimationFrame(() => {
      if (tooltipEl) tooltipEl.style.opacity = '1';
    });
  };

  const hide = () => {
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  };

  let timeout: NodeJS.Timeout | null = null;

  triggerEl.addEventListener('mouseenter', () => {
    timeout = setTimeout(show, delay);
  });

  triggerEl.addEventListener('mouseleave', () => {
    if (timeout) clearTimeout(timeout);
    hide();
  });
}

export function createInteractiveTooltip(
  triggerEl: HTMLElement,
  content: string,
  options?: {
    delay?: number;
    position?: 'top' | 'bottom' | 'left' | 'right';
    html?: boolean; // allow full HTML, not just plain text
    width?: string;
  },
) {
  const delay = options?.delay ?? 0;
  const position = options?.position ?? 'top';
  const width = options?.width ?? '500px';
  const allowHtml = options?.html ?? false;

  let tooltipEl: HTMLDivElement | null = null;
  let timeout: NodeJS.Timeout | null = null;

  const show = () => {
    if (tooltipEl) return;

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'dkani-floating-tooltip';

    if (allowHtml) {
      tooltipEl.innerHTML = content;
    } else {
      tooltipEl.innerHTML = content.replace(/\n/g, '<br>');
    }

    Object.assign(tooltipEl.style, {
      position: 'absolute',
      zIndex: '10000',
      background: 'var(--background-secondary)',
      color: 'var(--text-normal)',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      whiteSpace: 'normal',
      pointerEvents: 'auto', // allow interaction!
      transition: 'opacity 0.15s ease-in-out',
      opacity: '0',
      maxWidth: width,
    });

    document.body.appendChild(tooltipEl);

    const rect = triggerEl.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();

    let top = 0,
      left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tipRect.height - 8;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.left - tipRect.width - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tipRect.height / 2;
        left = rect.right + 8;
        break;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;

    requestAnimationFrame(() => {
      if (tooltipEl) tooltipEl.style.opacity = '1';
    });

    // Keep tooltip open when mouse is over it
    tooltipEl.addEventListener('mouseenter', () => {
      if (timeout) clearTimeout(timeout);
    });
    tooltipEl.addEventListener('mouseleave', hide);
  };

  const hide = () => {
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  };

  triggerEl.addEventListener('mouseenter', () => {
    timeout = setTimeout(show, delay);
  });
  triggerEl.addEventListener('mouseleave', () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(hide, 300); // small delay to allow entering the tooltip
  });
}
