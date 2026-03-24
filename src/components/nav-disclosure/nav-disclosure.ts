import { verticalKeyNavigation } from '../../utils/keyboard.js';

const HOVER_DELAY = 150;

/**
 * Navigation Disclosure component — APG Disclosure Navigation (Hybrid) Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/
 *
 * Wraps multiple `<pari-disclosure persistent>` children for dropdown navigation.
 * Each disclosure contains a top-level link, a toggle button ([data-trigger]),
 * and a submenu ([data-content]) with child links ([data-item]).
 *
 * Child disclosures must use the `persistent` attribute — this component
 * owns all close behavior: sibling close, Escape, blur, and hover.
 *
 * @element pari-nav-disclosure
 */
export class PariNavDisclosure extends HTMLElement {
	private _handleOpen = this._onOpen.bind(this);
	private _handleKeydown = this._onKeydown.bind(this);
	private _handleBlur = this._onBlur.bind(this);
	private _hoverTimeouts = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

	connectedCallback() {
		const disclosures = this._disclosures;

		disclosures.forEach((d) => {
			const trigger = d.querySelector<HTMLElement>('[data-trigger]');
			if (trigger) {
				trigger.setAttribute('aria-haspopup', 'true');
			}

			d.addEventListener('mouseenter', () => this._onMouseEnter(d));
			d.addEventListener('mouseleave', () => this._onMouseLeave(d));
		});

		this.addEventListener('disclosure:open', this._handleOpen);
		this.addEventListener('keydown', this._handleKeydown);
		document.addEventListener('focusin', this._handleBlur);
	}

	disconnectedCallback() {
		this.removeEventListener('disclosure:open', this._handleOpen);
		this.removeEventListener('keydown', this._handleKeydown);
		document.removeEventListener('focusin', this._handleBlur);
		this._hoverTimeouts.forEach((t) => clearTimeout(t));
		this._hoverTimeouts.clear();
	}

	private get _disclosures(): HTMLElement[] {
		return Array.from(this.querySelectorAll<HTMLElement>(':scope > pari-disclosure'));
	}

	private get _openDisclosure(): HTMLElement | null {
		return this._disclosures.find((d) => d.hasAttribute('open')) ?? null;
	}

	private _closeAll(restoreFocus = false) {
		for (const disclosure of this._disclosures) {
			if (disclosure.hasAttribute('open')) {
				(disclosure as any).hide(restoreFocus);
			}
		}
	}

	private _onMouseEnter(disclosure: HTMLElement) {
		const existing = this._hoverTimeouts.get(disclosure);
		if (existing) {
			clearTimeout(existing);
			this._hoverTimeouts.delete(disclosure);
		}

		if (!disclosure.hasAttribute('open')) {
			this._closeSiblings(disclosure);
			(disclosure as any).show();
		}
	}

	private _onMouseLeave(disclosure: HTMLElement) {
		this._hoverTimeouts.set(
			disclosure,
			setTimeout(() => {
				if (disclosure.hasAttribute('open')) {
					(disclosure as any).hide(false);
				}
				this._hoverTimeouts.delete(disclosure);
			}, HOVER_DELAY)
		);
	}

	private _closeSiblings(opened: HTMLElement) {
		for (const disclosure of this._disclosures) {
			if (disclosure !== opened && disclosure.hasAttribute('open')) {
				(disclosure as any).hide(false);
			}
		}
	}

	private _onOpen(event: Event) {
		const opened = (event.target as HTMLElement).closest('pari-disclosure');
		if (!opened || opened.parentElement !== this) return;

		this._closeSiblings(opened);
	}

	private _onBlur() {
		setTimeout(() => {
			const focused = document.activeElement;
			if (!focused || focused === document.body) return;
			if (this.contains(focused)) return;

			this._closeAll(false);
		}, 0);
	}

	private _onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			const open = this._openDisclosure;
			if (open) {
				event.preventDefault();
				const trigger = open.querySelector<HTMLElement>('[data-trigger]');
				(open as any).hide(false);
				trigger?.focus();
			}
			return;
		}

		const target = event.target as HTMLElement;

		const trigger = target.closest('[data-trigger]');
		if (trigger) {
			const disclosure = trigger.closest('pari-disclosure');
			if (disclosure && disclosure.parentElement === this) {
				this._onTriggerKeydown(event, disclosure as HTMLElement);
				return;
			}
		}

		const item = target.closest('[data-item]');
		if (item) {
			const disclosure = item.closest('pari-disclosure') as HTMLElement | null;
			if (disclosure && disclosure.parentElement === this) {
				this._onChildKeydown(event, disclosure);
			}
		}
	}

	private _onTriggerKeydown(event: KeyboardEvent, disclosure: HTMLElement) {
		const key = event.key;
		if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

		event.preventDefault();

		if (!disclosure.hasAttribute('open')) {
			(disclosure as any).show();
		}

		const content = disclosure.querySelector<HTMLElement>('[data-content]');
		if (!content) return;

		const items = Array.from(content.querySelectorAll<HTMLElement>('[data-item]'));
		if (items.length === 0) return;

		const focusTarget = key === 'ArrowDown' ? items[0] : items[items.length - 1];
		focusTarget.focus();
	}

	private _onChildKeydown(event: KeyboardEvent, disclosure: HTMLElement) {
		const content = disclosure.querySelector('[data-content]');
		if (!content) return;

		const items = Array.from(content.querySelectorAll<HTMLElement>('[data-item]'));

		verticalKeyNavigation({
			event,
			items,
			loop: false,
		});
	}
}

customElements.define('pari-nav-disclosure', PariNavDisclosure);
