# Pari

Accessible web component library. Vanilla TypeScript, no runtime dependencies, unstyled.

## Accessibility first

Every component is built to the [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). Keyboard interactions, focus management, and ARIA attributes are handled automatically. You write the markup; Pari handles the behavior.

## Components

| Component             | What it does                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `pari-disclosure`     | Toggles visibility of a content region. Click the trigger, the panel shows or hides.                    |
| `pari-accordion`      | Groups multiple disclosures. Arrow keys move between headers; Home/End jump to first/last.              |
| `pari-tabs`           | Manages a tablist and its panels. Handles roving tabindex so only the active tab is in the focus order. |
| `pari-dialog`         | Wraps the native `<dialog>` element. Adds scroll lock on the body and returns focus when closed.        |
| `pari-popover`        | Thin wrapper around the Popover API. Pairs a trigger button with its popup content.                     |
| `pari-nav-disclosure` | Dropdown navigation that opens on hover, Enter, Space, or arrow down. Closes when focus leaves.         |

## Example

```html
<pari-disclosure>
	<button data-trigger aria-expanded="false">What is Pari?</button>
	<div data-content hidden>
		<p>An accessible web component library.</p>
	</div>
</pari-disclosure>
```

The component keeps `aria-expanded`, `aria-controls`, and `hidden` in sync with the actual state. Once you import the module, the custom element handles everything else.

## Browser support

These components use modern platform features. Here's when support landed:

| Feature                          | Chrome          | Firefox         | Safari           |
| -------------------------------- | --------------- | --------------- | ---------------- |
| Custom elements (all components) | 67+ (May 2018)  | 63+ (Oct 2017)  | 12.1+ (Mar 2019) |
| `<dialog>` (`pari-dialog`)       | 37+ (Aug 2014)  | 98+ (Feb 2022)  | 15.4+ (Mar 2022) |
| Popover API (`pari-popover`)     | 114+ (May 2023) | 125+ (Apr 2024) | 17+ (Sep 2023)   |

Polyfills aren't included. Most components work anywhere Custom Elements v1 is supported. `pari-dialog` and `pari-popover` need the native APIs—check your analytics before using them.

## Install

```bash
npm install pari-components
```

## Usage

### ESM (bundler or modern browser)

```js
// Everything
import 'pari-components';

// Or just what you need
import 'pari-components/disclosure';
import 'pari-components/tabs';
```

### Script tag

```html
<script src="/path/to/components.iife.js"></script>

<pari-disclosure>
	<button data-trigger>Show more</button>
	<div data-content hidden>Your content here.</div>
</pari-disclosure>
```

The IIFE bundle registers all components on load.

## Styling

Pari ships no CSS. Style the components however you already style your site—plain CSS, Tailwind, CSS modules, whatever. The components don't inject styles or use shadow DOM, so your selectors work directly on the markup.

## Development

```bash
npm install
npm run storybook    # Component explorer + docs
npm run build        # Library build (ESM + IIFE)
npm test             # Vitest + Storybook tests
```

## License

[MIT](LICENSE)
