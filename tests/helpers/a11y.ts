import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Run an axe-core audit against the Storybook preview iframe. */
export async function checkA11y(page: Page) {
	const storyFrame = page.frame({ url: /iframe\.html/ });

	if (!storyFrame) {
		throw new Error('Could not find Storybook preview iframe');
	}

	const { violations } = await new AxeBuilder({
		page: storyFrame as any,
	}).analyze();

	const report = violations
		.map(
			(v) =>
				`[${v.impact}] ${v.id}: ${v.description}\n` +
				v.nodes.map((n) => `  ${n.html}`).join('\n')
		)
		.join('\n\n');

	expect(violations, `Accessibility violations:\n${report}`).toHaveLength(0);
}
