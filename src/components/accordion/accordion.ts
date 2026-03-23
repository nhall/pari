import { verticalKeyNavigation, horizontalKeyNavigation } from '../../utils/keyboard.js';

/**
 * Accordion component — APG Accordion Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Wraps multiple `<pari-disclosure>` children with group-level behavior:
 * keyboard navigation between triggers, grouped closing, and always-open mode.
 *
 * @element pari-accordion
 *
 * @attr {boolean} grouped         - Close siblings when one opens.
 * @attr {boolean} always-open     - One item must remain open (implies grouped).
 * @attr {'vertical'|'horizontal'} orientation - Arrow key direction. Defaults to vertical.
 * @attr {boolean} loop-navigation - Wraps arrow keys at boundaries.
 */
export class PariAccordion extends HTMLElement {
	private _handleOpen = this._onOpen.bind(this);
	private _handleKeydown = this._onKeydown.bind(this);

	connectedCallback() {
		this.addEventListener('disclosure:open', this._handleOpen);
		this.addEventListener('keydown', this._handleKeydown);

		if (this.hasAttribute('always-open')) {
			this._enforceAlwaysOpen();
		}
	}

	disconnectedCallback() {
		this.removeEventListener('disclosure:open', this._handleOpen);
		this.removeEventListener('keydown', this._handleKeydown);
	}

	private get _disclosures(): HTMLElement[] {
		return Array.from(this.querySelectorAll<HTMLElement>(':scope > pari-disclosure'));
	}

	private get _triggers(): HTMLElement[] {
		return this._disclosures
			.map((d) => d.querySelector<HTMLElement>('[data-trigger]'))
			.filter((t): t is HTMLElement => t !== null);
	}

	private _onOpen(event: Event) {
		const opened = (event.target as HTMLElement).closest('pari-disclosure');
		if (!opened || opened.parentElement !== this) return;

		if (this.hasAttribute('grouped') || this.hasAttribute('always-open')) {
			for (const disclosure of this._disclosures) {
				if (disclosure !== opened && disclosure.hasAttribute('open')) {
					(disclosure as any).hide(false);
				}
			}
		}

		if (this.hasAttribute('always-open')) {
			this._enforceAlwaysOpen();
		}
	}

	private _onKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		const trigger = target.closest('[data-trigger]');
		if (!trigger) return;

		const disclosure = trigger.closest('pari-disclosure');
		if (!disclosure || disclosure.parentElement !== this) return;

		const triggers = this._triggers;
		const orientation = this.getAttribute('orientation') || 'vertical';
		const navigate = orientation === 'horizontal' ? horizontalKeyNavigation : verticalKeyNavigation;

		navigate({
			event,
			items: triggers,
			loop: this.hasAttribute('loop-navigation'),
		});
	}

	private _enforceAlwaysOpen() {
		const disclosures = this._disclosures;
		const openItems = disclosures.filter((d) => d.hasAttribute('open'));

		if (openItems.length === 0 && disclosures.length > 0) {
			(disclosures[0] as any).show();
		}

		for (const disclosure of disclosures) {
			if (disclosure.hasAttribute('open')) {
				disclosure.setAttribute('no-collapse', '');
			} else {
				disclosure.removeAttribute('no-collapse');
			}
		}
	}
}

customElements.define('pari-accordion', PariAccordion);
