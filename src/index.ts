// Importing a component file registers its custom element via customElements.define().
// Re-exporting the class makes it available for ESM consumers who need
// to extend or reference the constructor (e.g. instanceof checks).

export { PariDisclosure } from './components/disclosure/disclosure';
export { PariAccordion } from './components/accordion/accordion';
export { PariTabs } from './components/tabs/tabs';
export { PariDialog } from './components/dialog/dialog';
export { PariPopover } from './components/popover/popover';
