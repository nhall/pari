# Pari

Accessible web component library. Vanilla TypeScript, zero runtime dependencies, zero CSS.

_Pari_, from Latin, meaning "equal."

## Components

| Component | What it does |
|-----------|-------------|
| `pari-disclosure` | Show/hide toggle. FAQ answers, expandable sections, mobile menus. |
| `pari-accordion` | Grouped disclosure sections with keyboard navigation. |
| `pari-tabs` | Tabbed interface with roving tabindex and panel management. |
| `pari-dialog` | Modal dialog wrapping native `<dialog>` with scroll lock. |
| `pari-popover` | Lightweight popup wrapping the native Popover API. |
| `pari-nav-disclosure` | Dropdown navigation with hover, keyboard, and focus management. |

Components follow the [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) where applicable. Keyboard interactions, focus management, and ARIA attributes are handled for you.

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

The IIFE bundle registers all components automatically. No init script needed.

## Styling

Pari ships no CSS. Bring your own styles, whatever approach works for your project. No specificity fights, no overrides, no "how do I customize the look." You own the styles completely.

## Development

```bash
npm install
npm run storybook    # Component explorer + docs
npm run build        # Library build (ESM + IIFE)
npm test             # Vitest + Storybook tests
```

## License

[MIT](LICENSE)
