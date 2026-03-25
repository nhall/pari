export const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Call `callback` when focus moves outside `container`. Defers check to next microtask. */
export function onFocusOutside(container: HTMLElement, callback: () => void) {
	setTimeout(() => {
		const focused = document.activeElement;
		if (!focused || focused === document.body) return;
		if (container.contains(focused)) return;
		callback();
	}, 0);
}
