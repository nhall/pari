/** Singleton module — all Pari components on a page share one handler registry. */

type DeeplinkHandler = () => void;

interface DeeplinkEntry {
	selector: string;
	handler: DeeplinkHandler;
}

const handlers: DeeplinkEntry[] = [];
let listening = false;

function handleHash() {
	const hash = window.location.hash;
	if (!hash || hash.length < 2) return;

	let id: string;
	try {
		id = decodeURIComponent(hash.slice(1));
	} catch {
		return;
	}

	const target = document.getElementById(id);
	if (!target) return;

	for (const { selector, handler } of handlers) {
		if (target.closest(selector)) {
			handler();
			break;
		}
	}
}

export function register(selector: string, handler: DeeplinkHandler) {
	handlers.push({ selector, handler });

	if (!listening) {
		listening = true;
		window.addEventListener('hashchange', handleHash);
	}

	handleHash();
}

export function unregister(selector: string, handler: DeeplinkHandler) {
	const index = handlers.findIndex(
		(entry) => entry.selector === selector && entry.handler === handler
	);

	if (index !== -1) {
		handlers.splice(index, 1);
	}
}

export function updateHash(id: string, set: boolean) {
	if (!id) return;

	if (set) {
		history.replaceState(null, '', `#${id}`);
	} else if (window.location.hash === `#${id}`) {
		history.replaceState(
			null,
			'',
			window.location.pathname + window.location.search
		);
	}
}
