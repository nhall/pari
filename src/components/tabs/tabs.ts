import { uid } from '../../utils/uid.js';
import {
	verticalKeyNavigation,
	horizontalKeyNavigation,
} from '../../utils/keyboard.js';

/**
 * Tabs component — APG Tabs Pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Light DOM custom element. Manages roles, aria-selected, aria-controls,
 * aria-labelledby, tabindex, and the hidden attribute on child elements
 * identified by [data-tab] and [data-panel].
 *
 * @element pari-tabs
 *
 * @attr {boolean} manual            - Require Enter/Space to activate a tab (default: automatic on focus).
 * @attr {'horizontal'|'vertical'} orientation - Arrow key direction. Defaults to horizontal.
 * @attr {boolean} loop-navigation   - Wraps arrow keys at boundaries.
 * @attr {boolean} hidden-until-found - Uses hidden="until-found" for inactive panels.
 *
 * @fires tabs:change - After a tab activates. detail: { tab, panel, index }
 */
export class PariTabs extends HTMLElement {
	private _handleClick = this._onClick.bind(this);
	private _handleKeydown = this._onKeydown.bind(this);
	private _handleBeforeMatch = this._onBeforeMatch.bind(this);

	connectedCallback() {
		const tablist = this._tablist;
		if (!tablist) return;

		tablist.setAttribute('role', 'tablist');

		if (this.getAttribute('orientation') === 'vertical') {
			tablist.setAttribute('aria-orientation', 'vertical');
		}

		const tabs = this._tabs;
		const panels = this._panels;

		tabs.forEach((tab, i) => {
			const panel = panels[i];
			if (!panel) return;

			if (!tab.id) tab.id = uid('pari-tab');
			if (!panel.id) panel.id = uid('pari-tabpanel');

			tab.setAttribute('role', 'tab');
			tab.setAttribute('aria-controls', panel.id);

			panel.setAttribute('role', 'tabpanel');
			panel.setAttribute('aria-labelledby', tab.id);
		});

		const activeIndex = tabs.findIndex((t) => t.hasAttribute('aria-selected') && t.getAttribute('aria-selected') === 'true');
		this._activate(activeIndex >= 0 ? activeIndex : 0, false);

		this.addEventListener('click', this._handleClick);
		this.addEventListener('keydown', this._handleKeydown);

		if (this.hasAttribute('hidden-until-found')) {
			panels.forEach((panel) => {
				panel.addEventListener('beforematch', this._handleBeforeMatch);
			});
		}
	}

	disconnectedCallback() {
		this.removeEventListener('click', this._handleClick);
		this.removeEventListener('keydown', this._handleKeydown);

		if (this.hasAttribute('hidden-until-found')) {
			this._panels.forEach((panel) => {
				panel.removeEventListener('beforematch', this._handleBeforeMatch);
			});
		}
	}

	private get _tablist(): HTMLElement | null {
		return this.querySelector<HTMLElement>('[data-tablist]');
	}

	private get _tabs(): HTMLElement[] {
		const tablist = this._tablist;
		if (!tablist) return [];
		return Array.from(tablist.querySelectorAll<HTMLElement>(':scope > [data-tab]'));
	}

	private get _panels(): HTMLElement[] {
		return Array.from(this.querySelectorAll<HTMLElement>(':scope > [data-panel]'));
	}

	private _activate(index: number, dispatch = true) {
		const tabs = this._tabs;
		const panels = this._panels;
		const hiddenUntilFound = this.hasAttribute('hidden-until-found');

		tabs.forEach((tab, i) => {
			const isActive = i === index;
			const panel = panels[i];

			tab.setAttribute('aria-selected', String(isActive));
			tab.setAttribute('tabindex', isActive ? '0' : '-1');

			if (!panel) return;

			if (isActive) {
				panel.removeAttribute('hidden');
			} else {
				const value = hiddenUntilFound ? 'until-found' : '';
				panel.setAttribute('hidden', value);
			}

			this._managePanelTabindex(panel, isActive);
		});

		if (dispatch) {
			this.dispatchEvent(
				new CustomEvent('tabs:change', {
					bubbles: true,
					detail: {
						tab: tabs[index],
						panel: panels[index],
						index,
					},
				})
			);
		}
	}

	private _managePanelTabindex(panel: HTMLElement, isActive: boolean) {
		if (!isActive) {
			panel.removeAttribute('tabindex');
			return;
		}

		const hasFocusable = panel.querySelector(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);

		if (hasFocusable) {
			panel.removeAttribute('tabindex');
		} else {
			panel.setAttribute('tabindex', '0');
		}
	}

	private _onClick(event: Event) {
		const target = event.target as HTMLElement;
		const tab = target.closest('[data-tab]');
		if (!tab) return;

		const tabs = this._tabs;
		const index = tabs.indexOf(tab as HTMLElement);
		if (index === -1) return;

		this._activate(index);
		(tab as HTMLElement).focus();
	}

	private _onKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('[data-tab]')) return;

		const tabs = this._tabs;
		const orientation = this.getAttribute('orientation') || 'horizontal';
		const navigate = orientation === 'vertical' ? verticalKeyNavigation : horizontalKeyNavigation;

		const handled = navigate({
			event,
			items: tabs,
			loop: this.hasAttribute('loop-navigation'),
		});

		if (handled && !this.hasAttribute('manual')) {
			const focused = document.activeElement as HTMLElement;
			const index = tabs.indexOf(focused);
			if (index !== -1) {
				this._activate(index);
			}
		}
	}

	private _onBeforeMatch(event: Event) {
		const panel = event.target as HTMLElement;
		const panels = this._panels;
		const index = panels.indexOf(panel);
		if (index !== -1) {
			this._activate(index);
		}
	}
}

customElements.define('pari-tabs', PariTabs);
