let counter = 0;

export function uid(prefix: string): string {
	return `${prefix}-${++counter}`;
}
