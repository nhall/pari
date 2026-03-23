import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Run an axe-core audit against the current page. */
export async function checkA11y(page: Page) {
	const { violations } = await new AxeBuilder({ page })
		.exclude('#storybook-root')
		.include('#storybook-root')
		.disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
		.analyze();

	const report = violations
		.map(
			(v) =>
				`[${v.impact}] ${v.id}: ${v.description}\n` +
				v.nodes.map((n) => `  ${n.html}`).join('\n')
		)
		.join('\n\n');

	expect(violations, `Accessibility violations:\n${report}`).toHaveLength(0);
}
