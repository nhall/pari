import { announce } from '../../utils/announce.js';

/**
 * Notification component. Wraps the native Popover API (popover="manual").
 * https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 *
 * Light DOM custom element. Sets ARIA attributes on [data-content] and calls
 * announce() on show() so screen readers are notified without a focus move.
 *
 * Per WCAG 2.2.1, notifications do not auto-dismiss. Call hide() from your
 * own code if timed dismissal is required, and ensure users can extend the time.
 *
 * @element pari-notification
 *
 * @attr {'status'|'alert'} role - ARIA role for the notification.
 *   'status' (default) → polite announcement, does not interrupt.
 *   'alert' → assertive announcement, interrupts immediately. Use for errors
 *   and critical messages only.
 *
 * @fires notification:open  - After the notification opens.  detail: { instance }
 * @fires notification:close - After the notification closes. detail: { instance }
 */
export class PariNotification extends HTMLElement {
	private _content: HTMLElement | null = null;
	private _closeBtn: HTMLElement | null = null;
	private _priority: 'polite' | 'assertive' = 'polite';

	private _handleToggle = this._onToggle.bind(this);
	private _handleClose = this._onClose.bind(this);

	connectedCallback() {
		this._content = this.querySelector<HTMLElement>('[data-content]');

		if (!this._content) return;

		if (!this._content.hasAttribute('popover')) {
			this._content.setAttribute('popover', 'manual');
		}

		const role = this.getAttribute('role') ?? 'status';
		this._priority = role === 'alert' ? 'assertive' : 'polite';
		this._content.setAttribute('role', role);
		this._content.setAttribute('aria-atomic', 'true');
		this._content.setAttribute('aria-live', this._priority);

		this._content.addEventListener('toggle', this._handleToggle);

		this._closeBtn = this.querySelector<HTMLElement>('[data-close]');
		this._closeBtn?.addEventListener('click', this._handleClose);
	}

	disconnectedCallback() {
		this._content?.removeEventListener('toggle', this._handleToggle);
		this._closeBtn?.removeEventListener('click', this._handleClose);
	}

	get open(): boolean {
		return this._content?.matches(':popover-open') ?? false;
	}

	/** Show the notification and announce its content to screen readers. */
	show() {
		if (!this._content || this.open) return;
		this._content.showPopover();
		announce(this._content.textContent?.trim() ?? '', this._priority);
	}

	/** Hide the notification. */
	hide() {
		if (!this._content || !this.open) return;
		this._content.hidePopover();
	}

	private _onToggle(event: Event) {
		const toggleEvent = event as ToggleEvent;
		const action = toggleEvent.newState === 'open' ? 'open' : 'close';

		this.dispatchEvent(
			new CustomEvent(`notification:${action}`, {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	private _onClose() {
		this.hide();
	}
}

customElements.define('pari-notification', PariNotification);
