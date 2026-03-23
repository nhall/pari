import { uid } from '../../utils/uid.js';
import { verticalKeyNavigation } from '../../utils/keyboard.js';

/**
 * Disclosure component — APG Disclosure Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Light DOM custom element. Manages aria-expanded, aria-controls,
 * and the hidden attribute on child elements identified by
 * [data-trigger] and [data-content].
 *
 * @element pari-disclosure
 *
 * @attr {boolean} open           - Reflects open state. Set to start open.
 * @attr {boolean} persistent     - Disables auto-close (escape, blur, outside click).
 * @attr {boolean} hidden-until-found - Uses hidden="until-found" when closed.
 * @attr {boolean} keyboard-navigation - Enables arrow/Home/End on [data-item] children.
 * @attr {boolean} loop-navigation - Wraps arrow keys (requires keyboard-navigation).
 * @attr {string}  media          - CSS media query; component active only while matching.
 *
 * @fires disclosure:open  - After opening.  detail: { instance }
 * @fires disclosure:close - After closing.  detail: { instance }
 */
export class PariDisclosure extends HTMLElement {
	static observedAttributes = ['open'];

	private _trigger: HTMLElement | null = null;
	private _content: HTMLElement | null = null;
	private _enabled = false;
	private _syncing = false;
	private _mediaQueryList: MediaQueryList | null = null;

	private _handleClick = this._onClick.bind(this);
	private _handleEscape = this._onEscape.bind(this);
	private _handleBlur = this._onBlur.bind(this);
	private _handleOutsideClick = this._onOutsideClick.bind(this);
	private _handleBeforeMatch = this._onBeforeMatch.bind(this);
	private _handleMediaChange = this._onMediaChange.bind(this);
	private _handleItemKeydown = this._onItemKeydown.bind(this);

	connectedCallback() {
		this._trigger = this._ownChild('[data-trigger]');
		this._content = this._ownChild('[data-content]');

		if (!this._trigger || !this._content) return;

		const media = this.getAttribute('media');

		if (media) {
			this._mediaQueryList = window.matchMedia(media);
			this._mediaQueryList.addEventListener('change', this._handleMediaChange);

			if (this._mediaQueryList.matches) {
				this._enable();
			}
		} else {
			this._enable();
		}
	}

	disconnectedCallback() {
		this._disable();

		if (this._mediaQueryList) {
			this._mediaQueryList.removeEventListener('change', this._handleMediaChange);
			this._mediaQueryList = null;
		}
	}

	attributeChangedCallback(name: string) {
		if (name === 'open' && this._enabled && !this._syncing) {
			this._sync();
		}
	}

	get open(): boolean {
		return this.hasAttribute('open');
	}

	set open(value: boolean) {
		if (value) {
			this.setAttribute('open', '');
		} else {
			this.removeAttribute('open');
		}
	}

	/** Toggle the disclosure open or closed. */
	toggle() {
		if (!this._enabled) return;

		if (this.open) {
			if (this.hasAttribute('no-collapse')) return;
			this.open = false;
		} else {
			this.open = true;
		}
	}

	/** Open the disclosure. No-op if already open. */
	show() {
		if (!this._enabled || this.open) return;
		this.open = true;
	}

	/** Close the disclosure. Returns focus to the trigger by default. */
	hide(restoreFocus = true) {
		if (!this._enabled || !this.open) return;
		this.open = false;

		if (restoreFocus && this._trigger) {
			this._trigger.focus();
		}
	}

	private _enable() {
		if (this._enabled || !this._trigger || !this._content) return;
		this._enabled = true;

		if (!this._content.id) {
			this._content.id = uid('pari-disclosure-content');
		}

		this._trigger.setAttribute('aria-controls', this._content.id);
		this.addEventListener('click', this._handleClick);

		if (this.hasAttribute('hidden-until-found')) {
			this._content.addEventListener('beforematch', this._handleBeforeMatch);
		}

		if (this.hasAttribute('keyboard-navigation') && this._content) {
			this._content.addEventListener('keydown', this._handleItemKeydown);
		}

		this._syncing = true;
		this._sync();
		this._syncing = false;
	}

	private _disable() {
		if (!this._enabled) return;

		if (this.open) {
			this._unbindGlobal();
		}

		this._trigger?.removeAttribute('aria-expanded');
		this._trigger?.removeAttribute('aria-controls');
		this._content?.removeAttribute('hidden');

		this.removeEventListener('click', this._handleClick);

		if (this.hasAttribute('hidden-until-found') && this._content) {
			this._content.removeEventListener('beforematch', this._handleBeforeMatch);
		}

		if (this.hasAttribute('keyboard-navigation') && this._content) {
			this._content.removeEventListener('keydown', this._handleItemKeydown);
		}

		this._enabled = false;
	}

	private _sync() {
		if (!this._trigger || !this._content) return;

		const isOpen = this.open;

		this._trigger.setAttribute('aria-expanded', String(isOpen));

		if (isOpen) {
			this._content.removeAttribute('hidden');
			this._bindGlobal();
		} else {
			const value = this.hasAttribute('hidden-until-found') ? 'until-found' : '';
			this._content.setAttribute('hidden', value);
			this._unbindGlobal();
		}

		if (!this._syncing) {
			this._dispatch(isOpen ? 'open' : 'close');
		}
	}

	private _bindGlobal() {
		if (this.hasAttribute('persistent')) return;

		document.addEventListener('keydown', this._handleEscape);
		document.addEventListener('focusin', this._handleBlur);
		document.addEventListener('click', this._handleOutsideClick);
	}

	private _unbindGlobal() {
		document.removeEventListener('keydown', this._handleEscape);
		document.removeEventListener('focusin', this._handleBlur);
		document.removeEventListener('click', this._handleOutsideClick);
	}

	private _dispatch(action: string) {
		this.dispatchEvent(
			new CustomEvent(`disclosure:${action}`, {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	/**
	 * querySelector scoped to this instance — skips children that
	 * belong to a nested pari-disclosure.
	 */
	private _ownChild(selector: string): HTMLElement | null {
		const el = this.querySelector<HTMLElement>(selector);

		if (!el) return null;
		if (el.closest('pari-disclosure') !== this) return null;

		return el;
	}

	private _onClick(event: Event) {
		const target = event.target as HTMLElement;

		const closer = target.closest('[data-close]');

		if (closer && this.contains(closer as Node)) {
			this.hide();
			return;
		}

		const trigger = target.closest('[data-trigger]');

		if (trigger && trigger === this._trigger) {
			this.toggle();
		}
	}

	private _onEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		this.hide();
	}

	private _onBlur() {
		setTimeout(() => {
			const focused = document.activeElement;

			if (!focused || focused === document.body) return;
			if (this.contains(focused)) return;

			this.hide(false);
		}, 0);
	}

	private _onOutsideClick(event: MouseEvent) {
		if (this.contains(event.target as Node)) return;
		this.hide(false);
	}

	private _onBeforeMatch() {
		this.show();
	}

	private _onMediaChange(event: MediaQueryListEvent) {
		if (event.matches) {
			this._enable();
		} else {
			this._disable();
		}
	}

	private _onItemKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;

		if (!target.closest('[data-item]')) return;

		const items = Array.from(
			this._content!.querySelectorAll<HTMLElement>('[data-item]')
		);

		verticalKeyNavigation({
			event,
			items,
			loop: this.hasAttribute('loop-navigation'),
		});
	}
}

customElements.define('pari-disclosure', PariDisclosure);
