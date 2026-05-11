# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-05-11

### Security

- Bumped `fast-uri` to 3.1.2 in the lockfile. No impact on the published package: `fast-uri` is a transitive dev dependency (`vite-plugin-dts` → `api-extractor` → `ajv`) and is not included in `files`.

## [0.1.0] - 2025-04-01

### Added

- Initial release: `pari-disclosure`, `pari-accordion`, `pari-tabs`, `pari-dialog`, `pari-popover`, `pari-nav-disclosure`.
