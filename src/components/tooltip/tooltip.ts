import { uid } from '../../utils/uid.js';

/**
 * Tooltip component, APG Tooltip Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * Light DOM custom element. Manages `role="tooltip"` on the content
 * element and `aria-describedby` on the trigger. Uses the Popover API
 * for top-layer rendering with CSS anchor positioning.
 *
 * @element pari-tooltip
 *
 * @attr {number} delay - Hover show delay in milliseconds (default: 100).
 *   Focus always shows immediately. Hide on mouseleave always uses a fixed
 *   150ms debounce regardless of this value.
 *
 * @fires tooltip:show - After the tooltip shows. detail: { instance }
 * @fires tooltip:hide - After the tooltip hides. detail: { instance }
 */
export class PariTooltip extends HTMLElement {
	private _trigger: HTMLElement | null = null;
	private _content: HTMLElement | null = null;
	private _showTimeout: ReturnType<typeof setTimeout> | null = null;
	private _hideTimeout: ReturnType<typeof setTimeout> | null = null;
	private _didSetRole = false;
	private _didSetPopover = false;

	private _handleMouseEnter = this._onMouseEnter.bind(this);
	private _handleMouseLeave = this._onMouseLeave.bind(this);
	private _handleFocus = this._onFocus.bind(this);
	private _handleBlur = this._onBlur.bind(this);
	private _handleDocEscape = this._onDocEscape.bind(this);

	connectedCallback() {
		if (!this.firstElementChild) {
			// Children not yet parsed — script ran before DOM (e.g. IIFE in <head>).
			setTimeout(() => { if (this.isConnected) this.connectedCallback(); }, 0);
			return;
		}

		this._trigger = this.querySelector<HTMLElement>('[data-trigger]');
		this._content = this.querySelector<HTMLElement>('[data-content]');

		if (!this._trigger || !this._content) return;

		if (!this._content.id) {
			this._content.id = uid('pari-tooltip-content');
		}

		if (!this._content.hasAttribute('role')) {
			this._content.setAttribute('role', 'tooltip');
			this._didSetRole = true;
		}

		if (!this._content.hasAttribute('popover')) {
			this._content.setAttribute('popover', 'manual');
			this._didSetPopover = true;
		}

		this._trigger.setAttribute('aria-describedby', this._content.id);

		const anchorName = `--${this._content.id}`;
		(this._trigger.style as any).anchorName = anchorName;
		(this._content.style as any).positionAnchor = anchorName;

		this._trigger.addEventListener('mouseenter', this._handleMouseEnter);
		this._trigger.addEventListener('mouseleave', this._handleMouseLeave);
		this._trigger.addEventListener('focus', this._handleFocus);
		this._trigger.addEventListener('blur', this._handleBlur);
	}

	disconnectedCallback() {
		this._clearTimeouts();
		document.removeEventListener('keydown', this._handleDocEscape);

		this._trigger?.removeEventListener('mouseenter', this._handleMouseEnter);
		this._trigger?.removeEventListener('mouseleave', this._handleMouseLeave);
		this._trigger?.removeEventListener('focus', this._handleFocus);
		this._trigger?.removeEventListener('blur', this._handleBlur);
		this._trigger?.removeAttribute('aria-describedby');
		if (this._trigger) (this._trigger.style as any).anchorName = '';

		if (this._didSetRole) this._content?.removeAttribute('role');
		if (this._didSetPopover) this._content?.removeAttribute('popover');
		if (this._content) (this._content.style as any).positionAnchor = '';
	}

	get open(): boolean {
		return this._content?.matches(':popover-open') ?? false;
	}

	/** Show the tooltip immediately, without delay. */
	show() {
		if (!this._content || this.open) return;
		this._clearTimeouts();
		this._content.showPopover();
		document.addEventListener('keydown', this._handleDocEscape);
		this.dispatchEvent(
			new CustomEvent('tooltip:show', {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	/** Hide the tooltip immediately, without delay. */
	hide() {
		if (!this._content || !this.open) return;
		this._clearTimeouts();
		this._content.hidePopover();
		document.removeEventListener('keydown', this._handleDocEscape);
		this.dispatchEvent(
			new CustomEvent('tooltip:hide', {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	private get _delay(): number {
		const val = parseInt(this.getAttribute('delay') ?? '', 10);
		return isNaN(val) ? 100 : val;
	}

	private _onMouseEnter() {
		this._clearTimeouts();
		this._showTimeout = setTimeout(() => this.show(), this._delay);
	}

	private _onMouseLeave() {
		this._clearTimeouts();
		this._hideTimeout = setTimeout(() => this.hide(), 150);
	}

	private _onFocus() {
		// Focus always shows immediately — no delay per APG.
		this._clearTimeouts();
		this.show();
	}

	private _onBlur() {
		this._clearTimeouts();
		this.hide();
	}

	private _onDocEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			// Hide without moving focus — trigger retains focus if it had it.
			this.hide();
		}
	}

	private _clearTimeouts() {
		if (this._showTimeout !== null) {
			clearTimeout(this._showTimeout);
			this._showTimeout = null;
		}
		if (this._hideTimeout !== null) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}
	}
}

customElements.define('pari-tooltip', PariTooltip);
