import { lockScroll, unlockScroll } from '../../utils/scroll-lock.js';

/**
 * Dialog component — APG Dialog (Modal) Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Light DOM custom element wrapping a native `<dialog>`. Focus trapping,
 * Escape-to-close, and focus restoration are handled by the browser.
 * This element adds scroll locking, backdrop click, trigger binding,
 * and state management.
 *
 * @element pari-dialog
 *
 * @attr {boolean} close-on-backdrop - Close when clicking the backdrop.
 * @attr {boolean} no-scroll-lock    - Disable scroll locking when open.
 *
 * @fires dialog:open  - After the dialog opens.  detail: { instance }
 * @fires dialog:close - After the dialog closes. detail: { instance }
 */
export class PariDialog extends HTMLElement {
	private _dialog: HTMLDialogElement | null = null;

	private _handleClick = this._onClick.bind(this);
	private _handleClose = this._onClose.bind(this);
	private _handleBackdropClick = this._onBackdropClick.bind(this);

	connectedCallback() {
		this._dialog = this.querySelector<HTMLDialogElement>('dialog');
		if (!this._dialog) return;

		this._dialog.setAttribute('aria-modal', 'true');

		const trigger = this.querySelector<HTMLElement>('[data-trigger]');
		if (trigger) {
			trigger.setAttribute('aria-haspopup', 'dialog');
		}

		this.addEventListener('click', this._handleClick);
		this._dialog.addEventListener('close', this._handleClose);

		if (this.hasAttribute('close-on-backdrop')) {
			this._dialog.addEventListener('click', this._handleBackdropClick);
		}
	}

	disconnectedCallback() {
		this.removeEventListener('click', this._handleClick);

		if (this._dialog) {
			this._dialog.removeEventListener('close', this._handleClose);
			this._dialog.removeEventListener('click', this._handleBackdropClick);
		}
	}

	get open(): boolean {
		return this._dialog?.open ?? false;
	}

	/** Open the dialog as a modal. */
	show() {
		if (!this._dialog || this._dialog.open) return;

		this._dialog.showModal();

		if (!this.hasAttribute('no-scroll-lock')) {
			lockScroll();
		}

		this.dispatchEvent(
			new CustomEvent('dialog:open', {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	/** Close the dialog. */
	hide() {
		if (!this._dialog || !this._dialog.open) return;
		this._dialog.close();
	}

	private _onClick(event: Event) {
		const target = event.target as HTMLElement;

		const closer = target.closest('[data-close]');
		if (closer && this.contains(closer as Node)) {
			this.hide();
			return;
		}

		const trigger = target.closest('[data-trigger]');
		if (trigger && this.contains(trigger as Node)) {
			this.show();
		}
	}

	private _onClose() {
		if (!this.hasAttribute('no-scroll-lock')) {
			unlockScroll();
		}

		this.dispatchEvent(
			new CustomEvent('dialog:close', {
				bubbles: true,
				detail: { instance: this },
			})
		);
	}

	private _onBackdropClick(event: MouseEvent) {
		if (!this._dialog) return;

		const rect = this._dialog.getBoundingClientRect();
		const isOutside =
			event.clientY < rect.top ||
			event.clientY > rect.bottom ||
			event.clientX < rect.left ||
			event.clientX > rect.right;

		if (isOutside) {
			this.hide();
		}
	}
}

customElements.define('pari-dialog', PariDialog);
