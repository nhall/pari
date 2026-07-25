# Pari

Zero-dependency, light DOM custom elements built to APG (ARIA Authoring Practices Guide) standards.

## Language

**Dialog**:
A light DOM custom element (`pari-dialog`) wrapping a native `<dialog>`, implementing the APG Dialog (Modal) Pattern. Handles scroll locking, backdrop click, trigger binding, and deeplinking.
_Avoid_: Modal

**media attribute**:
A CSS media query string, evaluated via `window.matchMedia()`, that scopes a component's active state to a viewport condition. Shared across `pari-disclosure` and `pari-dialog`, but its effect differs per component: on disclosure it enables/disables the JS enhancement and leaves markup visible; on dialog it also force-closes an open dialog and gates the trigger and deeplink from opening it while non-matching, since a native `<dialog>` has no "disabled but visible" state to fall back to.
_Avoid_: matchMedia, breakpoint
