import { uid } from '../../utils/uid.js';
import { onFocusOutside } from '../../utils/focus.js';

/**
 * Popover component — wraps the native Popover API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 *
 * Light DOM custom element. Automatically wires the trigger to
 * the content via `popovertarget`. The browser handles Enter/Space,
 * Escape, and light-dismiss. This element adds hover mode, close
 * on blur, close button support, and custom events.
 *
 * @element pari-popover
 *
 * @attr {boolean} hover         - Open on mouseenter, close on mouseleave (150ms debounce).
 * @attr {boolean} close-on-blur - Close when focus moves outside the popover and trigger.
 *
 * @fires popover:open  - After the popover opens.  detail: { instance }
 * @fires popover:close - After the popover closes. detail: { instance }
 */
export class PariPopover extends HTMLElement {
	private _trigger: HTMLElement | null = null;
	private _content: HTMLElement | null = null;
	private _hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	private _handleToggle = this._onToggle.bind(this);
	private _handleClick = this._onClick.bind(this);
	private _handleBlur = this._onBlur.bind(this);
	private _handleMouseEnter = this._onMouseEnter.bind(this);
	private _handleMouseLeave = this._onMouseLeave.bind(this);

	connectedCallback() {
		this._trigger = this.querySelector<HTMLElement>('[data-trigger]');
		this._content = this.querySelector<HTMLElement>('[data-content]');

		if (!this._trigger || !this._content) return;

		if (!this._content.id) {
			this._content.id = uid('pari-popover');
		}

		const anchorName = `--${this._content.id}`;
		(this._trigger.style as any).anchorName = anchorName;
		(this._content.style as any).positionAnchor = anchorName;

		this._content.addEventListener('toggle', this._handleToggle);
		this.addEventListener('click', this._handleClick);

		if (this.hasAttribute('hover')) {
			this._trigger.addEventListener('mouseenter', this._handleMouseEnter);
			this._trigger.addEventListener('mouseleave', this._handleMouseLeave);
			this._content.addEventListener('mouseenter', this._handleMouseEnter);
			this._content.addEventListener('mouseleave', this._handleMouseLeave);
		} else {
			this._trigger.setAttribute('popovertarget', this._content.id);
		}
	}

	disconnectedCallback() {
		this.removeEventListener('click', this._handleClick);

		if (this._content) {
			this._content.removeEventListener('toggle', this._handleToggle);
		}

		if (this.hasAttribute('hover')) {
			this._content?.removeEventListener('mouseenter', this._handleMouseEnter);
			this._content?.removeEventListener('mouseleave', this._handleMouseLeave);
			this._trigger?.removeEventListener('mouseenter', this._handleMouseEnter);
			this._trigger?.removeEventListener('mouseleave', this._handleMouseLeave);
		}

		if (this._trigger) {
			this._trigger.removeAttribute('popovertarget');
		}

		this._clearHoverTimeout();
		document.removeEventListener('focusin', this._handleBlur);
	}

	get open(): boolean {
		return this._content?.matches(':popover-open') ?? false;
	}

	/** Open the popover. */
	show() {
		if (!this._content || this.open) return;
		this._content.showPopover();
	}

	/** Close the popover. */
	hide() {
		if (!this._content || !this.open) return;
		this._content.hidePopover();
	}

	private _onToggle(event: Event) {
		const toggleEvent = event as ToggleEvent;

		if (toggleEvent.newState === 'open') {
			if (this.hasAttribute('close-on-blur')) {
				document.addEventListener('focusin', this._handleBlur);
			}

			this.dispatchEvent(
				new CustomEvent('popover:open', {
					bubbles: true,
					detail: { instance: this },
				})
			);
		} else {
			document.removeEventListener('focusin', this._handleBlur);

			this.dispatchEvent(
				new CustomEvent('popover:close', {
					bubbles: true,
					detail: { instance: this },
				})
			);
		}
	}

	private _onClick(event: Event) {
		const target = event.target as HTMLElement;
		const closer = target.closest('[data-close]');

		if (closer && this.contains(closer as Node)) {
			this.hide();
		}
	}

	private _onBlur() {
		onFocusOutside(this, () => this.hide());
	}

	private _onMouseEnter() {
		this._clearHoverTimeout();
		this.show();
	}

	private _onMouseLeave() {
		this._clearHoverTimeout();
		this._hoverTimeout = setTimeout(() => {
			this.hide();
		}, 150);
	}

	private _clearHoverTimeout() {
		if (this._hoverTimeout !== null) {
			clearTimeout(this._hoverTimeout);
			this._hoverTimeout = null;
		}
	}
}

customElements.define('pari-popover', PariPopover);
