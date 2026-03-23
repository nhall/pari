# Components

Accessible web component library. Vanilla TypeScript, zero runtime dependencies.

## Usage

### ESM (bundler or modern browser)

```js
import '@nhall/components';
```

### Script tag

```html
<!-- 1. Load the bundle — this registers all custom elements automatically -->
<script src="/path/to/components.iife.js"></script>

<!-- 2. Use the elements in markup — no JavaScript required -->
<my-accordion>
	<my-accordion-panel>...</my-accordion-panel>
</my-accordion>
```

The IIFE bundle calls `customElements.define()` for every component when it executes. Consumers just write HTML — no instantiation, no init script.

A `window.AccessibleComponents` global is available but is not part of normal usage. It's there if you need to check registration status or extend a component class programmatically.

## Development

```bash
npm install
npm run dev          # Vite dev server
npm run storybook    # Component explorer
npm run build        # Library build (ESM + IIFE)
npm test             # Playwright tests
```
