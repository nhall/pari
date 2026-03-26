# Pari

Accessible web component library. Vanilla TypeScript, zero runtime dependencies.

_Pari_, from Latin, meaning "equal."

## Usage

### ESM (bundler or modern browser)

```js
import 'pari-components';
```

### Script tag (WordPress, Cascade CMS, static sites)

```html
<!-- 1. Load the bundle. This registers all custom elements automatically. -->
<script src="/path/to/components.iife.js"></script>

<!-- 2. Use the elements in markup. No JavaScript required. -->
<pari-disclosure>
	<button data-trigger>Show more</button>
	<div data-content hidden>...</div>
</pari-disclosure>
```

The IIFE bundle calls `customElements.define()` for every component when it executes. Consumers just write HTML, no instantiation, no init script.

A `window.Pari` global is available but is not part of normal usage. It's there if you need to check registration status or extend a component class programmatically.

## Development

```bash
npm install
npm run dev          # Vite dev server
npm run storybook    # Component explorer
npm run build        # Library build (ESM + IIFE)
npm test             # Vitest + Storybook tests
```
