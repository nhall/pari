# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Pinned all workflow runners to `ubuntu-26.04` instead of `ubuntu-latest`. Ubuntu 26.04 is generally available on GitHub Actions, and pinning means the next Ubuntu move is a deliberate, tested change rather than a silent one under the release pipeline. Dev-only: the published package is unaffected.

## [0.4.1] - 2026-10-14

### Changed

- Releases are automated. Merging a release PR that bumps the version in `package.json` now tags the merge commit, publishes to npm with provenance (still through Trusted Publishing, still from a `v*` tag), and creates the GitHub Release with notes from this changelog. Dev-only: the published package is unaffected.
- `npm run test:smoke` is now a headless pass/fail check: it packs the tarball, loads the ESM and IIFE smoke pages in Chromium, and fails on any broken check. CI and the release workflow both run it. The old interactive version is `npm run test:smoke:browser`.
- Bumped `playwright` to 1.64.0, and the CI and release containers to `mcr.microsoft.com/playwright:v1.64.0-noble` with it, plus `@types/node`, `vite` and `vite-plugin-dts` patch updates. Dev-only: the published package is unaffected.

### Fixed

- The ESM build is no longer minified, so exported classes keep their real names (`PariDisclosure.name` was `"o"`). Class names now show up properly in devtools and stack traces. Your bundler still minifies for production, so shipped bundle sizes don't change. The IIFE bundle stays minified.

## [0.4.0] - 2026-10-14

### Added

- `media` attribute on `pari-dialog`. While the CSS media query doesn't match, the trigger, a `deeplink` hash, and `show()` can't open the dialog, and an open dialog closes through the normal close path (scroll unlocks, `dialog:close` fires). It stays closed when the query matches again. Unlike `media` on `pari-disclosure`, this closes the dialog instead of switching it off. See `docs/adr/0001-dialog-media-attribute-force-closes-instead-of-disabling.md`.

### Changed

- `pari-dialog` now sets `aria-modal="true"` on its `<dialog>` only while it's open, and removes it on close. Before, it was set once on connect and stayed there. A closed dialog that's styled visible, like an inline sidebar, no longer tells assistive technology it's modal.
- Bumped the vitest family (`vitest`, `@vitest/browser`, `@vitest/browser-playwright`, `@vitest/coverage-v8`) to 5.0.3, and Storybook (`storybook` and all `@storybook/*` addons) to 10.6.1, the first release whose `addon-vitest` accepts vitest 5. Dev-only: the published package is unaffected.
- Pinned `playwright` to 1.61.0 as an explicit devDependency so the client always matches the CI container image (`mcr.microsoft.com/playwright:v1.61.0-noble`). It was previously an unpinned peer of `@vitest/browser-playwright`, so a fresh resolve could pull a version with no matching image.
- Moved the release workflow's container to `mcr.microsoft.com/playwright:v1.61.0-noble` to match CI and the pinned `playwright`. It had been left on `v1.59.1`, which has no browser build for 1.61.0, so the pre-publish test step would have failed.

## [0.3.3] - 2026-06-09

### Added

- Logo image in the README.

## [0.3.2] - 2026-06-06

### Added

- `homepage` field in `package.json` pointing to the live Storybook ([pari-storybook.vercel.app](https://pari-storybook.vercel.app)).
- `bugs` field in `package.json` pointing to GitHub Issues.
- `tooltip` added to the `keywords` list (missed when 0.3.0 shipped).

### Changed

- Corrected the 0.3.1 changelog entry below to remove an inaccurate "restores tree-shakeable status" framing. The package was tree-shakeable in ESM form across all 0.x releases; the 0.3.1 change tightened the `sideEffects` declaration so consumer bundlers can eliminate unused shared utilities, but it did not change tree-shakeable status itself.

## [0.3.1] - 2026-06-06

### Changed

- Tightened `sideEffects` declaration from blanket `true` to a list of side-effectful files (`./dist/components/*.js` and `./dist/components.iife.js`). Consumer bundlers can now eliminate unused shared utilities from `dist/shared/` while `customElements.define()` registration on imported components is preserved.

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
