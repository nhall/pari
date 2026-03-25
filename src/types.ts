export interface PariDisclosureElement extends HTMLElement {
	open: boolean;
	show(): void;
	hide(restoreFocus?: boolean): void;
}
