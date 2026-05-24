let _region: HTMLElement | null = null;

function _getRegion(): HTMLElement {
	if (_region) return _region;

	const el = document.createElement('div');
	el.setAttribute('aria-live', 'polite');
	el.setAttribute('aria-atomic', 'true');
	el.style.position = 'absolute';
	el.style.width = '1px';
	el.style.height = '1px';
	el.style.padding = '0';
	el.style.margin = '-1px';
	el.style.overflow = 'hidden';
	el.style.clip = 'rect(0,0,0,0)';
	el.style.whiteSpace = 'nowrap';
	el.style.border = '0';
	document.body.appendChild(el);
	_region = el;
	return el;
}

/**
 * Announce a message to screen readers via a shared visually-hidden live region.
 *
 * @param message  - The text to announce.
 * @param priority - 'polite' waits for the user to be idle. 'assertive' interrupts immediately.
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
	const region = _getRegion();
	region.setAttribute('aria-live', priority);
	region.textContent = '';

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			region.textContent = message;
		});
	});
}
