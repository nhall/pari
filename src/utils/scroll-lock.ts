const LOCKED_CLASS = 'state-locked';

export function lockScroll() {
	const scrollY = window.scrollY;
	document.body.dataset.scrollY = scrollY.toString();
	document.body.style.top = `-${scrollY}px`;
	document.documentElement.style.scrollbarGutter = 'stable';
	document.documentElement.classList.add(LOCKED_CLASS);
}

export function unlockScroll() {
	document.documentElement.classList.remove(LOCKED_CLASS);
	document.documentElement.style.scrollbarGutter = '';

	const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
	document.body.style.top = '';
	delete document.body.dataset.scrollY;
	window.scrollTo({ top: scrollY, behavior: 'auto' });
}
