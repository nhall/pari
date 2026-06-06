# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2026-06-06

### Fixed

- Refined `sideEffects` from `true` to a list naming only the component-registration files (`./dist/components/*.js` and `./dist/components.iife.js`). Restores tree-shakeable status (visible on bundlephobia and per consumer bundlers) while preserving `customElements.define()` registration on import. Shared utilities under `dist/shared/` are now correctly marked side-effect-free.

## [0.3.0] - 2026-06-06

### Added

- New component: `pari-tooltip`. APG Tooltip Pattern. Shows on hover (configurable delay) or focus (immediate). Dismisses on Escape, blur, or mouseleave. Tooltip never receives focus. Wires `role="tooltip"` and `aria-describedby` automatically.

### Changed

- CI moved to Microsoft's official Playwright Docker container (`mcr.microsoft.com/playwright:v1.59.1-noble`). Browsers and system libraries are pre-installed in the image, eliminating the per-run `playwright install` step that had become unreliable on the ubuntu-latest runner.
- Added `SECURITY.md` describing the vulnerability reporting process and supported-versions policy.
- Configured Dependabot to open weekly PRs grouping minor/patch updates for npm and GitHub Actions.
- Tightened workflow token permissions: CI now declares `contents: read` at the workflow level so the default `GITHUB_TOKEN` starts read-only.
- Added the OpenSSF Scorecard action and badge. Weekly scan publishes results to scorecard.dev and uploads SARIF to GitHub code scanning.
- Pinned all GitHub Actions to commit SHAs and bumped to current majors (`checkout@v6`, `setup-node@v6`, `upload-artifact@v7`, `codeql-action@v4`, `scorecard-action@v2.4.3`). Dependabot maintains the SHAs automatically.

### Security

- Bumped the vitest family (`vitest`, `@vitest/browser`, `@vitest/browser-playwright`, `@vitest/coverage-v8`) to 4.1.8 to patch [GHSA-2h32-95rg-cppp](https://github.com/advisories/GHSA-2h32-95rg-cppp) (CVE-2026-47428). Dev-only impact: the vulnerable code path is in Vitest's browser-mode server, not in the published package.

## [0.2.1] - 2026-05-24

### Changed

- Updated README with usage and documentation for `pari-notification`.

## [0.2.0] - 2026-05-23

### Added

- New component: `pari-notification`. Displays a message via the Popover API and announces it to screen readers without moving focus.

### Fixed

- `connectedCallback` now defers when children are not yet parsed. Fixes IIFE bundles loaded in `<head>` running before the DOM is ready.

### Changed

- Smoke tests updated to cover `pari-notification` and to verify IIFE parity with the ESM bundle.

## [0.1.1] - 2026-05-11

### Security

- Bumped `fast-uri` to 3.1.2 in the lockfile. No impact on the published package: `fast-uri` is a transitive dev dependency (`vite-plugin-dts` → `api-extractor` → `ajv`) and is not included in `files`.

## [0.1.0] - 2025-04-01

### Added

- Initial release: `pari-disclosure`, `pari-accordion`, `pari-tabs`, `pari-dialog`, `pari-popover`, `pari-nav-disclosure`.
