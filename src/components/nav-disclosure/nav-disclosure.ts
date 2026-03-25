import { verticalKeyNavigation } from '../../utils/keyboard.js';
import { onFocusOutside } from '../../utils/focus.js';
import type { PariDisclosureElement } from '../../types.js';

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
	private _handleClick = this._onClick.bind(this);
	private _handleBlur = this._onBlur.bind(this);
	private _hoverTimeouts = new Map<PariDisclosureElement, ReturnType<typeof setTimeout>>();
	private _hoverListeners: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];

	connectedCallback() {
		for (const d of this._disclosures) {
			const trigger = d.querySelector<HTMLElement>('[data-trigger]');
			if (trigger) {
				trigger.setAttribute('aria-haspopup', 'true');
			}

			const enter = () => this._onMouseEnter(d);
			const leave = () => this._onMouseLeave(d);
			d.addEventListener('mouseenter', enter);
			d.addEventListener('mouseleave', leave);
			this._hoverListeners.push({ el: d, enter, leave });
		}

		this.addEventListener('disclosure:open', this._handleOpen);
		this.addEventListener('keydown', this._handleKeydown);
		this.addEventListener('click', this._handleClick, true);
		document.addEventListener('focusin', this._handleBlur);
	}

	disconnectedCallback() {
		this.removeEventListener('disclosure:open', this._handleOpen);
		this.removeEventListener('keydown', this._handleKeydown);
		this.removeEventListener('click', this._handleClick, true);
		document.removeEventListener('focusin', this._handleBlur);

		for (const { el, enter, leave } of this._hoverListeners) {
			el.removeEventListener('mouseenter', enter);
			el.removeEventListener('mouseleave', leave);
		}
		this._hoverListeners = [];

		this._hoverTimeouts.forEach((t) => clearTimeout(t));
		this._hoverTimeouts.clear();
	}

	private get _disclosures(): PariDisclosureElement[] {
		return Array.from(
			this.querySelectorAll<HTMLElement>(':scope > pari-disclosure')
		) as PariDisclosureElement[];
	}

	private get _openDisclosure(): PariDisclosureElement | null {
		return this._disclosures.find((d) => d.open) ?? null;
	}

	private _closeAll() {
		for (const d of this._disclosures) {
			if (d.open) d.hide(false);
		}
	}

	private _closeSiblings(opened: PariDisclosureElement) {
		for (const d of this._disclosures) {
			if (d !== opened && d.open) d.hide(false);
		}
	}

	private _onMouseEnter(disclosure: PariDisclosureElement) {
		const existing = this._hoverTimeouts.get(disclosure);
		if (existing) {
			clearTimeout(existing);
			this._hoverTimeouts.delete(disclosure);
		}

		if (!disclosure.open) {
			this._closeSiblings(disclosure);
			disclosure.show();
		}
	}

	private _onMouseLeave(disclosure: PariDisclosureElement) {
		this._hoverTimeouts.set(
			disclosure,
			setTimeout(() => {
				if (disclosure.open) disclosure.hide(false);
				this._hoverTimeouts.delete(disclosure);
			}, HOVER_DELAY)
		);
	}

	private _onClick(event: Event) {
		const target = event.target as HTMLElement;
		const trigger = target.closest('[data-trigger]');
		if (!trigger) return;

		const disclosure = trigger.closest('pari-disclosure') as PariDisclosureElement | null;
		if (!disclosure || disclosure.parentElement !== this) return;

		// Capture phase — prevent the child disclosure from handling its own click.
		event.stopPropagation();

		if (disclosure.open) {
			disclosure.hide(false);
		} else {
			this._closeSiblings(disclosure);
			disclosure.show();
		}
	}

	private _onOpen(event: Event) {
		const opened = (event.target as HTMLElement).closest(
			'pari-disclosure'
		) as PariDisclosureElement | null;
		if (!opened || opened.parentElement !== this) return;

		this._closeSiblings(opened);
	}

	private _onBlur() {
		onFocusOutside(this, () => this._closeAll());
	}

	private _onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			const open = this._openDisclosure;
			if (open) {
				event.preventDefault();
				const trigger = open.querySelector<HTMLElement>('[data-trigger]');
				open.hide(false);
				trigger?.focus();
			}
			return;
		}

		const target = event.target as HTMLElement;

		const trigger = target.closest('[data-trigger]');
		if (trigger) {
			const disclosure = trigger.closest('pari-disclosure') as PariDisclosureElement | null;
			if (disclosure && disclosure.parentElement === this) {
				this._onTriggerKeydown(event, disclosure);
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

	private _onTriggerKeydown(event: KeyboardEvent, disclosure: PariDisclosureElement) {
		const key = event.key;
		if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

		event.preventDefault();

		if (!disclosure.open) disclosure.show();

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
