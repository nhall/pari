export interface KeyNavigationOptions {
	event: KeyboardEvent;
	items: HTMLElement[];
	/** Return the focusable element for a given item. Defaults to the item itself. */
	getTrigger?: (item: HTMLElement) => HTMLElement;
	loop?: boolean;
}

function handleNavigation(
	options: KeyNavigationOptions,
	prevKey: string,
	nextKey: string,
): boolean {
	const { event, items, getTrigger = (el) => el, loop = false } = options;
	const key = event.key;

	let next: number | null = null;
	const active = document.activeElement as HTMLElement;
	const current = items.findIndex(
		(item) => item === active || item.contains(active)
	);

	if (key === 'Home') {
		next = 0;
	} else if (key === 'End') {
		next = items.length - 1;
	} else if (key === prevKey) {
		if (current <= 0) {
			next = loop ? items.length - 1 : null;
		} else {
			next = current - 1;
		}
	} else if (key === nextKey) {
		if (current >= items.length - 1) {
			next = loop ? 0 : null;
		} else {
			next = current + 1;
		}
	}

	if (next === null) return false;

	event.preventDefault();
	getTrigger(items[next]).focus();
	return true;
}

export function verticalKeyNavigation(options: KeyNavigationOptions): boolean {
	return handleNavigation(options, 'ArrowUp', 'ArrowDown');
}

export function horizontalKeyNavigation(options: KeyNavigationOptions): boolean {
	return handleNavigation(options, 'ArrowLeft', 'ArrowRight');
}
