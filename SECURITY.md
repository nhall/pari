# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Use GitHub's [private vulnerability reporting](https://github.com/nhall/pari/security/advisories/new) for this repository. That sends a notice only to the maintainer and gives us a place to discuss and patch without exposing details before a fix ships.

If GitHub's reporting flow is unavailable, you can email **nickjhall@gmail.com** with the subject line `pari security`.

Please include:

- A clear description of the issue and what an attacker could achieve.
- Steps to reproduce, or a minimal proof of concept.
- The version of `pari-components` you tested against.

## Response expectations

Pari is maintained by one person as a side project. I aim to:

- Acknowledge a report within **3 business days**.
- Confirm whether the report is in scope within **7 business days**.
- Ship a patch release within **14 business days** of confirming an in-scope report. Critical issues take priority over feature work.

## Supported versions

Only the latest published `0.x.y` release on npm receives security fixes. Once the project reaches `1.0.0`, this policy will be updated to cover the most recent major and the previous major.

## Scope

In scope:

- Bugs in published `pari-components` code that affect consumers of the library (e.g. XSS via component attributes, prototype pollution, missing ARIA state that breaks assistive tech in a way that compromises information disclosure).
- Issues in build output that consumers ship to their users.

Out of scope:

- Issues affecting only the development environment (Storybook, Vitest, Playwright). These are not shipped in the published package.
- Reports requiring a maliciously modified `pari-components` install (supply-chain attacks targeting the consumer's own dependency tree).
- Findings against `pari-storybook.vercel.app` infrastructure (please report directly to Vercel).
